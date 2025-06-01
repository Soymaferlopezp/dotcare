import React from 'react';
import styles from './Respiraciones.module.css';
import dotcaretext from '../assets/dotcaretext.png';
import respira1 from '../assets/respira1.png';
import respira2 from '../assets/respira2.png';
import respira3 from '../assets/respira3.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';

function Respiraciones() {
  const navigate = useNavigate();

  const handleCardClick = (title) => {
    if (title === 'Respira profundo') {
      navigate('/Respiracion1');
    }
  };

  return (
    <div className={styles.respiraciones}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <img src={dotcaretext} alt="DOTCARE Logo" className={styles.logo} />
        <nav className={styles.navMenu}>
          <button onClick={() => navigate('/Dashboard')} className={styles.navItem}>Perfil</button>
          <button className={`${styles.navItem} ${styles.active}`}>Respiraciones</button>
          <button className={styles.navItem}>Meditaciones</button>
          <button className={styles.navItem}>Bitácora</button>
          <button className={styles.navItem}>Habit Tracker</button>
          <button className={styles.navItem}>Recursos</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.walletContainer}>
          <ConnectButton showBalance />
        </div>

        <h1 className={styles.title}>Respiraciones</h1>

        <div className={styles.filterButtons}>
          <button className={styles.filterButton}>Todo</button>
          <button className={styles.filterButton}>Zen Jr.</button>
          <button className={styles.filterButton}>Builder</button>
          <button className={styles.filterButton}>Especialista</button>
          <button className={styles.filterButton}>To the moon</button>
        </div>

        <div className={styles.cardGrid}>
          <div className={styles.card} onClick={() => handleCardClick('Respira profundo')}>
            <img src={respira1} alt="Sesión 1" />
            <p className={styles.cardTitle}>Iniciación</p>
            <span className={styles.cardCategory}>Zen Jr.</span>
          </div>

          <div className={styles.card}>
            <img src={respira2} alt="Sesión 2" />
            <p className={styles.cardTitle}>Iniciando el día</p>
            <span className={styles.cardCategory}>To the moon</span>
          </div>

          <div className={styles.card}>
            <img src={respira3} alt="Sesión 3" />
            <p className={styles.cardTitle}>Terminando el día</p>
            <span className={styles.cardCategory}>Builder</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Respiraciones;

