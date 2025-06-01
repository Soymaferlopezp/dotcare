import React from 'react';
import styles from './CtaFooter.module.css';
import pandirela from '../assets/pandirela.png';
import CustomConnectButton from './CustomConnectButton';

function CtaFooter() {
  return (
    <div className={styles.ctaFooterContainer}>
      <h2 className={styles.ctaTitle}>Estamos creando un ecosistema brillante.<br/>
        Pero también merecemos ser parte de esa construcción.<br/>
        Cuidarnos también es Web3.
      </h2>

      <img
        src={pandirela}
        alt="Panda meditativo"
        className={styles.pandaImage}
      />

      <p className={styles.ctaText}>
      🧠 Tu wallet refleja no solo cuánto tienes… sino cómo te sientes.
      </p>

      <div className={styles.connectButton}>
        <CustomConnectButton label="Prueba DOTCARE" />
      </div>

      <p className={styles.footerNote}>
        Tu espacio está disponible 24/7. Siempre que lo necesites, estaré aquí
      </p>

      <p className={styles.footerNote}>© 2025 - BlockBears</p>
    </div>
  );
}

export default CtaFooter;


