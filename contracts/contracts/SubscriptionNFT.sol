// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * SubscriptionNFT — ERC-721 con 1 NFT por wallet (soulbound opcional) y vencimiento.
 * - Planes: 0=Mensual (30d), 1=Anual (365d).
 * - Descuentos ECDSA (EIP-712) firmados por backend.
 * - Anti-replay: nonce (bytes32) consumible + deadline (uint256).
 * - tokenURI http-based -> baseHttpURI + tokenId.
 * - Variant visual por código: 0=sin código, 1=DOTCARELOVER, 2=NERDCONF.
 */

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract SubscriptionNFT is ERC721, Ownable, EIP712 {
    using Strings for uint256;

    // ──────────────────────────────────────────────────────────
    // Constantes y tipos
    // ──────────────────────────────────────────────────────────
    uint8 public constant PLAN_MONTHLY = 0; // 30 días
    uint8 public constant PLAN_YEARLY  = 1; // 365 días

    // EIP-712: nombre y versión del dominio
    string private constant EIP712_NAME = "DotcareSubscription";
    string private constant EIP712_VERSION = "1";

    // Error para soulbound
    error Soulbound();

    // Payload firmado por backend para aplicar descuento
    struct DiscountPayload {
        bytes32 sessionId;     // id de sesión del checkout off-chain (H2)
        address wallet;        // msg.sender esperado
        uint8 planId;          // 0 mensual, 1 anual
        uint16 discountBps;    // 0..10000
        bytes32 nonce;         // anti-replay
        uint256 deadline;      // timestamp límite
        uint256 chainId;       // 420420422 (Paseo)
        address contractAddr;  // address(this)
        uint8 variant;         // 0/1/2
    }

    bytes32 private constant DISCOUNT_TYPEHASH = keccak256(
        "DiscountPayload(bytes32 sessionId,address wallet,uint8 planId,uint16 discountBps,bytes32 nonce,uint256 deadline,uint256 chainId,address contractAddr,uint8 variant)"
    );

    // ──────────────────────────────────────────────────────────
    // Storage
    // ──────────────────────────────────────────────────────────
    // Planes
    mapping(uint8 => uint256) public priceWei;     // precio base por plan
    mapping(uint8 => uint256) public durationSec;  // duración por plan

    // NFT por wallet
    uint256 private _nextTokenId = 1;
    mapping(address => uint256) private _tokenIdOf;      // 0 si no tiene
    mapping(uint256 => uint256) public expiresAt;        // por tokenId
    mapping(uint256 => uint8)    public variantOf;       // 0/1/2 por tokenId

    // Admin y config
    address public treasury;           // destino fondos en withdraw
    address public signer;             // firmante de descuentos
    string  private baseHttpURI;       // ej: https://.../api/metadata/

    // Soulbound
    bool public soulbound = true;      // por defecto bloqueado

    // Anti-replay
    mapping(bytes32 => bool) public nonceUsed;

    // ──────────────────────────────────────────────────────────
    // Eventos
    // ──────────────────────────────────────────────────────────
    event Subscribed(
        address indexed user,
        uint256 indexed tokenId,
        uint8   planId,
        uint256 priceWei,
        uint16  discountBps,
        uint256 netPrice,
        uint256 expiresAt,
        uint8   variant,
        bytes32 sessionId
    );

    event Renewed(
        address indexed user,
        uint256 indexed tokenId,
        uint8   planId,
        uint256 priceWei,
        uint16  discountBps,
        uint256 netPrice,
        uint256 expiresAt,
        bytes32 sessionId
    );

    // ──────────────────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────────────────
    constructor(
        address initialOwner,
        address _treasury,
        address _signer,
        string memory _baseHttpURI
    )
        ERC721("Dotcare Subscription", "DCSUB")
        Ownable(initialOwner)
        EIP712(EIP712_NAME, EIP712_VERSION)
    {
        require(_treasury != address(0), "treasury=0");
        require(_signer   != address(0), "signer=0");
        treasury    = _treasury;
        signer      = _signer;
        baseHttpURI = _baseHttpURI;

        // Defaults: 30d / 365d
        durationSec[PLAN_MONTHLY] = 30 days;
        durationSec[PLAN_YEARLY]  = 365 days;

        // Precios se ajustan vía setPrices() o en el deploy script
        priceWei[PLAN_MONTHLY] = 0;
        priceWei[PLAN_YEARLY]  = 0;
    }

    // ──────────────────────────────────────────────────────────
    // Helpers de lectura
    // ──────────────────────────────────────────────────────────
    function tokenIdOf(address user) public view returns (uint256) {
        return _tokenIdOf[user]; // 0 si no tiene
    }

    function isActive(address user) public view returns (bool) {
        uint256 tid = _tokenIdOf[user];
        if (tid == 0) return false;
        return expiresAt[tid] >= block.timestamp;
    }

    function _tokenURIFor(uint256 tokenId) internal view returns (string memory) {
        return string(abi.encodePacked(baseHttpURI, tokenId.toString()));
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "URI query for nonexistent token");
        return _tokenURIFor(tokenId);
    }

    // ──────────────────────────────────────────────────────────
    // Admin
    // ──────────────────────────────────────────────────────────
    function setPrices(uint256 monthlyWei, uint256 yearlyWei) external onlyOwner {
        priceWei[PLAN_MONTHLY] = monthlyWei;
        priceWei[PLAN_YEARLY]  = yearlyWei;
    }

    function setDurations(uint256 monthlySec, uint256 yearlySec) external onlyOwner {
        require(monthlySec > 0 && yearlySec > 0, "dur=0");
        durationSec[PLAN_MONTHLY] = monthlySec;
        durationSec[PLAN_YEARLY]  = yearlySec;
    }

    function setSigner(address _signer) external onlyOwner {
        require(_signer != address(0), "signer=0");
        signer = _signer;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "treasury=0");
        treasury = _treasury;
    }

    function setBaseHttpURI(string calldata _uri) external onlyOwner {
        baseHttpURI = _uri;
    }

    function setSoulbound(bool _soulbound) external onlyOwner {
        soulbound = _soulbound;
    }

    function withdraw() external onlyOwner {
        (bool ok, ) = payable(treasury).call{value: address(this).balance}("");
        require(ok, "withdraw failed");
    }

    // ──────────────────────────────────────────────────────────
    // Subscribe / Renew con descuento firmado
    // ──────────────────────────────────────────────────────────
    function subscribe(
        uint8 planId,
        bytes calldata discountSig,
        DiscountPayload calldata p
    ) external payable {
        require(planId == PLAN_MONTHLY || planId == PLAN_YEARLY, "plan invalid");
        require(p.planId == planId, "payload.plan mismatch");
        require(block.timestamp <= p.deadline, "expired");
        require(!nonceUsed[p.nonce], "nonce used");
        require(p.wallet == msg.sender, "wallet mismatch");
        require(p.chainId == block.chainid, "chainId mismatch");
        require(p.contractAddr == address(this), "contract mismatch");

        // Verificación ECDSA/EIP-712
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    DISCOUNT_TYPEHASH,
                    p.sessionId,
                    p.wallet,
                    p.planId,
                    p.discountBps,
                    p.nonce,
                    p.deadline,
                    p.chainId,
                    p.contractAddr,
                    p.variant
                )
            )
        );
        address recovered = ECDSA.recover(digest, discountSig);
        require(recovered == signer, "bad signature");

        nonceUsed[p.nonce] = true;

        uint256 basePrice = priceWei[planId];
        require(basePrice > 0, "price=0");

        // Descuento en basis points (0..10000)
        require(p.discountBps <= 10000, "bps>10000");
        uint256 netPrice = basePrice - ((basePrice * p.discountBps) / 10000);
        require(msg.value == netPrice, "wrong msg.value");

        uint256 tid = _tokenIdOf[msg.sender];
        uint256 newExpiry;
        if (tid == 0) {
            // Mint inicial (1 por wallet)
            tid = _nextTokenId++;
            _safeMint(msg.sender, tid);

            // Guardar variant en mint; en renovaciones se conserva
            variantOf[tid] = p.variant;

            // Primer vencimiento
            uint256 dur = durationSec[planId];
            newExpiry = block.timestamp + dur;
            expiresAt[tid] = newExpiry;

            _tokenIdOf[msg.sender] = tid;

            emit Subscribed(
                msg.sender,
                tid,
                planId,
                basePrice,
                p.discountBps,
                netPrice,
                newExpiry,
                p.variant,
                p.sessionId
            );
        } else {
            // Renovación: sumar sobre max(now, actual)
            uint256 curr = expiresAt[tid];
            uint256 start = curr > block.timestamp ? curr : block.timestamp;
            newExpiry = start + durationSec[planId];
            expiresAt[tid] = newExpiry;

            emit Renewed(
                msg.sender,
                tid,
                planId,
                basePrice,
                p.discountBps,
                netPrice,
                newExpiry,
                p.sessionId
            );
        }
    }

    // ──────────────────────────────────────────────────────────
    // Soulbound — bloquear aprobaciones y transferencias
    // ──────────────────────────────────────────────────────────

    // Bloquea approvals públicos cuando soulbound=true
    function approve(address to, uint256 tokenId) public virtual override {
        if (soulbound) revert Soulbound();
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override {
        if (soulbound) revert Soulbound();
        super.setApprovalForAll(operator, approved);
    }

    // Hook interno: bloquea cualquier movimiento (excepto mint/burn) si soulbound=true
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        if (soulbound) {
            address from = _ownerOf(tokenId);
            // Permitimos mint (from==0) y burn (to==0); bloqueamos transferencias regulares.
            if (from != address(0) && to != address(0)) revert Soulbound();
        }
        return super._update(to, tokenId, auth);
    }
}
