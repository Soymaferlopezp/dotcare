import React from 'react';
import styles from './ProblemSolution.module.css';
import pandibot from '../assets/pandibot.png';
import bearbrown from '../assets/Bearbrown.png';

function ProblemSolution() {
  return (
    <div className={styles['problem-solution']}>

      {/* Sección: Solución */}
      <section className={styles.section}>
        <div className={styles['text-content']}>
          <h2>Tu espacio de calma en el mundo descentralizado.</h2>
          <p>
            El spot disponible 24/7 para ayudarte a mantener hábitos de autocuidado, meditar, reflexionar y desahogarte.<br/><br/>
            En todo momento te acompaña <b>Pax</b>, nuestro bot entrenado para ayudarte a crear hábitos de bienestar reales, en tu idioma y a tu ritmo.<br/><br/>
            Accede a prácticas de autocuidado, herramientas de bienestar, recursos útiles y momentos de calma alojadas en la cadena.
          </p>
        </div>
        <div className={styles['image-content']}>
          <img src={pandibot} alt="Bot de bienestar DOTCARE" />
        </div>
      </section>

      {/* Sección: Problema */}
      <section className={`${styles.section} ${styles.problem}`}>
        <div className={styles['text-content']}>
          <h2>El burnout en Web3 ya es parte del ecosistema y la salud mental también está en el roadmap</h2>
          <p>
            El ritmo acelerado del ecosistema puede ser abrumador, es por ello que muchas personas sienten ansiedad, agotamiento y desconexión emocional producto de los deadlines, cambios tecnológicos y presión constante por mantenerse actualizados.<br/><br/>

            No se trata solo de “poner bienestar en blockchain”. Se trata de repensar cómo cuidamos la mente en un entorno <b>hiperconectado, descentralizado y mentalmente exigente</b>.
          </p>
        </div>
        <div className={styles['image-content']}>
          <img src={bearbrown} alt="Bearbrown preocupado" />
        </div>
      </section>

    </div>
  );
}

export default ProblemSolution;

