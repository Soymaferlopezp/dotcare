import React from 'react';
import styles from './Benefits.module.css';

function Benefits() {
  return (
    <section className={styles.benefitsSection}>
      <h2 className={styles.title}>Lo que ganas cuando te das una respiro</h2>
      <div className={styles.grid}>

        <div className={styles.benefit}>
          <span className={styles.emoji}>🧘</span>
          <h3 className={styles.benefitTitle}>Bienestar en cadena</h3>
          <p>
            Encuentra espacios de calma dentro del mundo cripto.  
            Meditaciones, recursos, y ejercicios simples para reconectar contigo desde la blockchain.
          </p>
        </div>

        <div className={styles.benefit}>
          <span className={styles.emoji}>🔓</span>
          <h3 className={styles.benefitTitle}>Acceso sin barreras</h3>
          <p>
            No pedimos tus datos. No necesitas registro.  
            Conectar tu wallet es suficiente para comenzar tu viaje de autocuidado.
          </p>
        </div>

        <div className={styles.benefit}>
          <span className={styles.emoji}>🤖</span>
          <h3 className={styles.benefitTitle}>Apoyo 24/7</h3>
          <p>
            Nuestro sistema está disponible en todo momento,  
            para cuando necesites un espacio seguro, hablar o simplemente pausar.
          </p>
        </div>

        <div className={styles.benefit}>
          <span className={styles.emoji}>⚡</span>
          <h3 className={styles.benefitTitle}>Rápido y sin juicios</h3>
          <p>
            Interfaz mínima, simple y pensada para no abrumarte.  
            Lo necesario para acompañarte, sin más ruido.
          </p>
        </div>

        <div className={styles.benefit}>
          <span className={styles.emoji}>📚</span>
          <h3 className={styles.benefitTitle}>Recursos en Web3</h3>
          <p>
            Accede a guías, herramientas y recomendaciones  
            para gestionar ansiedad, burnout y estrés, con un enfoque 100% descentralizado.
          </p>
        </div>

        <div className={styles.benefit}>
          <span className={styles.emoji}>🌱</span>
          <h3 className={styles.benefitTitle}>Construido por y para la comunidad</h3>
          <p>
            DOTCARE nace del deseo de cuidar(nos) en Web3.  
            Cada herramienta refleja el aporte colectivo de quienes también sintieron la necesidad de parar.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Benefits;
