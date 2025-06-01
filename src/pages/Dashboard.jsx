import React from 'react';
import styles from './Dashboard.module.css';
import bearcute from '../assets/bearcute.png';
import beardotblock from '../assets/beardotblock.png';
import dotcaretext from '../assets/dotcaretext.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <img src={dotcaretext} alt="DOTCARE Logo" className={styles.logo} />
        <nav className={styles.navMenu}>
          <button className={`${styles.navItem} ${styles.active}`}>Perfil</button>
          <button className={styles.navItem} onClick={() => navigate('/respiraciones')}>
            Respiraciones
          </button>
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

        {/* Bienvenida */}
        <div className={styles.profileBox}>
          <img src={bearcute} alt="Bearcute" className={styles.profileImage} />
          <div className={styles.profileContent}>
            <h2 className={styles.profileTitle}>GM ✨ estás en tu espacio seguro 🌱</h2>
            <p className={styles.profileDescription}>
              Record 
            </p>
          </div>
        </div>

        {/* Cajitas */}
        <div className={styles.cardGrid}>
          <div className={styles.cardBox}>
            <p className={styles.cardTitle}>Mi progreso</p>
            <p className={styles.cardCount}>0</p>
          </div>
          <div className={styles.cardBox}>
            <p className={styles.cardTitle}>Mis prácticas</p>
            <p className={styles.cardCount}>0</p>
          </div>
          <div className={styles.cardBox}>
            <p className={styles.cardTitle}>Mi bitácora</p>
            <p className={styles.cardCount}>0</p>
          </div>
        </div>

        {/* Racha diaria */}
        <div className={styles.streakBox}>
          <h3 className={styles.streakTitle}>He trabajado 0 días en mí</h3>
          <div className={styles.streakDays}>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className={styles.dayCircle}>
                <span>{day}</span>
              </div>
            ))}
          </div>
          <button className={styles.streakButton}>Ver todo mi progreso</button>
        </div>

        {/* Bitácora */}
        <div className={styles.journalBox}>
          <h3 className={styles.journalTitle}>Mi Bitácora</h3>
          <div className={styles.journalRow}>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className={styles.journalCircle}>
                <span>{day}</span>
              </div>
            ))}
          </div>
          <button className={styles.viewAllButton}>Ver toda mi bitácora</button>
        </div>

        {/* Logros / Badges */}
        <div className={styles.achievementsBox}>
          <h3 className={styles.achievementsTitle}>Mis logros</h3>
          <div className={styles.badgeGrid}>
            <div className={styles.badgeItem}>
              <img src={beardotblock} alt="Badge bloqueado" className={styles.badgeImage} />
              <p className={styles.badgeLabel}>Primera Respiración</p>
            </div>
          </div>
          <button className={styles.viewAllButton}>Ver todos mis logros</button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

