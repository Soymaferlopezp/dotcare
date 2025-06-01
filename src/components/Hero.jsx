import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomConnectButton from './CustomConnectButton'; // ✅ Este es el bueno
import styles from './Hero.module.css';
import logo from '../assets/BearDOT - ico.png';
import panda from '../assets/BearDOT.png';

function Hero() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  return (
    <div className={styles.heroContainer}>
      <header className={styles.header}>
        <img src={logo} alt="DOTCARE logo" className={styles.logo} />

        {/* Botón superior: Launch dApp */}
        <div className={styles.connectButton}>
          <CustomConnectButton label="Launch dApp" />
        </div>
      </header>

      <main className={styles.mainContent}>
        <img src={panda} alt="Meditating Panda" className={styles.heroImage} />

        <h1 className={styles.title}>
          Respira. Pausa unos minutos y reconecta contigo.
          <br />
          Porque tu salud mental también está en el roadmap.
        </h1>

        <p className={styles.subtitle}>
          DOTCARE es tu espacio mental en Web3. Cuídate sin exponer tu identidad.
        </p>

        {/* Botón central: Explora DOTCARE */}
        <div className={styles.connectButton}>
          <CustomConnectButton label="Iniciar el modo Zen" />
        </div>

        <p className={styles.note}>
          Tus emociones son contratos inteligentes contigo mismo. Conecta tu wallet.
        </p>
      </main>
    </div>
  );
}

export default Hero;


