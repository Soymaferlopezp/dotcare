<p align="center">
  <img src="https://github.com/Soymaferlopezp/dotcare/blob/main/src/assets/BearDOT.png?raw=true" alt="BearDOT Logo" width="200"/>
</p>

<h1 align="center">DOTCARE — Tu espacio de calma en Web3 🧸💜</h1>

<p align="center">
  <i>Respira. Pausa unos minutos y reconecta contigo.<br/>
  Porque tu salud mental también está en el roadmap.</i>
</p>

---

## 🚀 Funcionalidades principales

- ✅ **Conexión con wallet** (testnet PAS – Polkadot Asset Hub)
- 🧘‍♀️ **Sesiones de respiración guiada y meditación**
- 🏆 **Mint de badge tras completar una sesión** (1 por wallet)
- 📊 **Dashboard personalizado**
- 🎯 **Validación de red correcta + redirección inteligente**

---

## ⚙️ Stack tecnológico

- **Frontend**: React + CSS Modules
- **Blockchain**: Polkadot Asset Hub (testnet PAS)
- **Conexión wallet**: RainbowKit + Wagmi
- **Smart contract**: `mintBadge()` (1 mint por wallet)
- **Deploy**: Vercel
- **Repositorio**: [github.com/Soymaferlopezp/dotcare](https://github.com/Soymaferlopezp/dotcare)

---

## 🌐 Demo en vivo

👉 [https://dotcare.vercel.app](https://dotcare.vercel.app)

---

## 🧑‍💻 ¿Cómo usarlo?

1. Ingresa al sitio y conecta tu wallet (testnet PAS)
2. Navega a la sección de respiraciones
3. Completa una sesión de respiración o meditación
4. Haz clic en “Terminé mi sesión” para mintear tu badge
5. Visualiza tu logro desbloqueado en el Dashboard

> DOTCARE no te juzga, solo te acompaña. 💜

---

## 🧠 Contrato inteligente principal

```solidity
function mintBadge() public {
  require(!hasMinted[msg.sender], "Ya minteaste tu badge.");
  _mint(msg.sender, 1, 1, "");
  hasMinted[msg.sender] = true;
}
✅ Lógica simple y efectiva

🔐 Solo un mint por wallet

📦 Deploy en testnet PAS

📜 Contrato inteligente completo
solidity
Copiar
Editar
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract DotcareBadge is ERC1155 {
    mapping(address => bool) public hasMinted;

    constructor() ERC1155("https://dotcare.app/metadata/{id}.json") {}

    function mintBadge() public {
        require(!hasMinted[msg.sender], "Ya minteaste tu badge.");
        _mint(msg.sender, 1, 1, "");
        hasMinted[msg.sender] = true;
    }
}
✅ Este contrato permite mintear una única medalla NFT (ID 1) por wallet al completar una sesión de respiración.
🧸 Simplificado, funcional y amigable para testeo en entornos de bienestar emocional en Web3.

🧪 Datos técnicos del contrato
🧾 Dirección del contrato: 0x9993b540afc1dac86fb05d06527594c91aa312d2

🔍 Explorer: Ver transacción en Blockscout (PAS)

⛓️ Red: Polkadot Asset Hub (Testnet PAS)

📦 Bloque: #55111

🧠 Gas usado: 2,499,749,973,000

🛠️ Hash de deploy: 0x6a15a2d6402a54df27adf48fb3d8e3e03d2cc7618f6cc5db49e9f3ba47a953b6

📂 Estructura del proyecto
bash
Copiar
Editar
src/
├── assets/                  # Imágenes y recursos visuales (BearDOT, íconos)
├── components/              # Componentes reutilizables (Hero, MintButton, etc.)
├── constants/               # Dirección del contrato + ABI
├── pages/                   # Vistas del sitio (Dashboard, Respiraciones)
├── wallet/                  # Lógica de conexión con wallet
└── main.jsx                 # Punto de entrada principal

🧑‍🤝‍🧑 Team DOTCARE
Nombre	Rol	
MaFer López 🧸	Dev | UX/UI Designer 
Mary 🌱	Reasercher | BizDev
Zula 💜	PM | Marketing

💫 Filosofía DOTCARE
“No se trata solo de poner bienestar en la blockchain, sino de crear un espacio donde puedas respirar, sentirte acompañado y construir sin romperte en el intento.”

📬 Contacto
https://x.com/mary_mlp8
https://x.com/Soymaferlopezp
https://x.com/Zulakyz 