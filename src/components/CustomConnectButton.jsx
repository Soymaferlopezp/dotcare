// src/components/CustomConnectButton.jsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './CustomConnectButton.module.css';


function CustomConnectButton({ label = "Conectar la billetera" }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain;

        return (
            <div
            aria-hidden={!ready}
            style={{
                opacity: ready ? 1 : 0,
                pointerEvents: ready ? 'auto' : 'none',
            }}
            >
            {!connected ? (
                <button onClick={openConnectModal} className={styles.connectButton}>
                {label}
                </button>
            ) : (
                <button onClick={openAccountModal} className={styles.connectButton}>
                {account.displayName}
                </button>
            )}
            </div>

        );
      }}
    </ConnectButton.Custom>
  );
}

export default CustomConnectButton;
