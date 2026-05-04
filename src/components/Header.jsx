import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="url(#lg1)" />
              <path d="M10 19 L16 25 L26 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6C63FF" />
                  <stop offset="1" stopColor="#48C9B0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>SistemPakar</span>
            <span className={styles.logoSub}>AnterAja</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            CF Method
          </span>
          <span className={styles.badge}>
            <span className={styles.badgeDot} style={{ background: '#48C9B0' }} />
            v1.0.0
          </span>
        </nav>
      </div>

      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Evaluasi Kinerja
            <span className={styles.heroGradient}> Pegawai</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Sistem Pakar berbasis <strong>Certainty Factor</strong> dengan Forward Chaining —
            penilaian objektif berbasis Disiplin, Produktivitas, dan Kehadiran.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>14+</span>
              <span className={styles.statLabel}>Rules Aktif</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>3</span>
              <span className={styles.statLabel}>Set Inferensi</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>5</span>
              <span className={styles.statLabel}>Variabel Input</span>
            </div>
          </div>
        </div>
        <div className={styles.heroDecor}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>
      </div>
    </header>
  );
};

export default Header;
