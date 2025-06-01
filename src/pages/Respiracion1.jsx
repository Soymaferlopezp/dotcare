import React from 'react';
import styles from './Respiracion1.module.css';
import dotcaretext from '../assets/dotcaretext.png';
import video from '../assets/respiracion-dotcare.mp4';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import MintButton from '../components/MintButton';


function Respiracion1() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <img src={dotcaretext} alt="DOTCARE Logo" className={styles.logo} />
        <nav className={styles.navMenu}>
          <button onClick={() => navigate('/Dashboard')} className={styles.navItem}>Perfil</button>
          <button onClick={() => navigate('/Respiraciones')} className={`${styles.navItem}`}>Respiraciones</button>
          <button className={styles.navItem}>Meditaciones</button>
          <button className={styles.navItem}>Bitácora</button>
          <button className={styles.navItem}>Habit Tracker</button>
          <button className={styles.navItem}>Recursos</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Wallet */}
        <div className={styles.walletContainer}>
          <ConnectButton showBalance />
        </div>

        {/* Título y descripción */}
        <h1 className={styles.title}>Iniciación</h1>
        <p className={styles.description}>
          Solo respira. <br/>
          Este es tu primer paso hacia una mente más tranquila.<br/>
          Una práctica breve que te ayudará a calmar tu sistema nervioso y reducir el ruido mental, para pausar, soltar tensión y reconectar contigo.<br/>
          Sin reglas. Sin prisa. Solo un minuto, solo para ti.
        </p>

        {/* Video */}
        <div className={styles.videoContainer}>
          <video className={styles.videoPlayer} controls>
            <source src={video} type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>

        {/* Botón para continuar */}
        <MintButton />

      </main>
    </div>
  );
}

export default Respiracion1;
