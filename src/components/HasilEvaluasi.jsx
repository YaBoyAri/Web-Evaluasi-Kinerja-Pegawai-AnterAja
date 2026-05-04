import { useEffect, useRef } from 'react';
import styles from './HasilEvaluasi.module.css';

const BADGE_CONFIG = {
  excellent: {
    label: 'Sangat Baik',
    gradient: 'linear-gradient(135deg, #27AE60 0%, #48C9B0 100%)',
    glow: 'rgba(39, 174, 96, 0.3)',
    icon: '🏆',
    barColor: '#27AE60',
  },
  good: {
    label: 'Baik',
    gradient: 'linear-gradient(135deg, #6C63FF 0%, #48C9B0 100%)',
    glow: 'rgba(108, 99, 255, 0.3)',
    icon: '✅',
    barColor: '#6C63FF',
  },
  average: {
    label: 'Cukup',
    gradient: 'linear-gradient(135deg, #F5A623 0%, #F39C12 100%)',
    glow: 'rgba(245, 166, 35, 0.3)',
    icon: '📈',
    barColor: '#F5A623',
  },
  poor: {
    label: 'Kurang',
    gradient: 'linear-gradient(135deg, #E74C3C 0%, #FF6584 100%)',
    glow: 'rgba(231, 76, 60, 0.3)',
    icon: '⚠️',
    barColor: '#E74C3C',
  },
};

const CfBar = ({ value, color, label }) => {
  const barRef = useRef(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = '0%';
      setTimeout(() => {
        if (barRef.current) {
          barRef.current.style.width = `${value}%`;
        }
      }, 100);
    }
  }, [value]);

  return (
    <div className={styles.cfBarWrap}>
      <div className={styles.cfBarHeader}>
        <span className={styles.cfBarLabel}>{label}</span>
        <span className={styles.cfBarValue}>{value}%</span>
      </div>
      <div className={styles.cfBarTrack}>
        <div
          ref={barRef}
          className={styles.cfBarFill}
          style={{ background: color, boxShadow: `0 0 10px ${color}60` }}
        />
      </div>
    </div>
  );
};

const HasilEvaluasi = ({ result }) => {
  const cfg = BADGE_CONFIG[result.badge] || BADGE_CONFIG.average;
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  return (
    <section className={styles.section} ref={cardRef} id="hasil-evaluasi">
      {/* Header Hasil */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>📊</div>
        <div>
          <h2 className={styles.sectionTitle}>Hasil Evaluasi Kinerja</h2>
          <p className={styles.sectionSub}>Berdasarkan inferensi mesin pakar dengan metode CF</p>
        </div>
      </div>

      {/* Main Result Card */}
      <div
        className={styles.mainCard}
        style={{ '--glow-color': cfg.glow, '--gradient': cfg.gradient }}
      >
        <div className={styles.mainCardBg} style={{ background: cfg.gradient }} />

        <div className={styles.mainCardContent}>
          <div className={styles.resultIcon}>{cfg.icon}</div>
          <div className={styles.resultMeta}>
            <span className={styles.resultLabel}>Kinerja Akhir Pegawai</span>
            <h3 className={styles.resultValue}>{result.kinerja}</h3>
            <p className={styles.resultDesc}>{result.deskripsiKinerja}</p>
          </div>
          <div className={styles.resultCf}>
            <span className={styles.cfPercent}>{result.persenKinerja}%</span>
            <span className={styles.cfPercentLabel}>Tingkat Keyakinan</span>
          </div>
        </div>

        {/* CF Bar Kinerja */}
        <div className={styles.mainCfBar}>
          <div
            className={styles.mainCfFill}
            style={{
              width: `${result.persenKinerja}%`,
              background: cfg.gradient,
            }}
          />
        </div>

        {/* Rule Tag */}
        <div className={styles.ruleTag}>
          <span className={styles.ruleLabel}>Rule Aktif:</span>
          <span className={styles.ruleId}>{result.ruleKinerja}</span>
        </div>
      </div>

      {/* Subgoal Cards */}
      <div className={styles.subGrid}>
        {/* Kedisiplinan */}
        <div className={styles.subCard}>
          <div className={styles.subCardHeader}>
            <span className={styles.subIcon}>⚖️</span>
            <div>
              <span className={styles.subTitle}>Kedisiplinan</span>
              <span className={styles.subRuleTag}>{result.ruleKedis}</span>
            </div>
            <span className={styles.subValue}>{result.kedisiplinan}</span>
          </div>
          <p className={styles.subDesc}>{result.deskripsiKedis}</p>
          <CfBar
            value={result.persenKedis}
            color="#6C63FF"
            label="CF Kedisiplinan"
          />
        </div>

        {/* Produktivitas */}
        <div className={styles.subCard}>
          <div className={styles.subCardHeader}>
            <span className={styles.subIcon}>🚀</span>
            <div>
              <span className={styles.subTitle}>Produktivitas</span>
              <span className={styles.subRuleTag}>{result.ruleProd}</span>
            </div>
            <span className={styles.subValue}>{result.produktivitas}</span>
          </div>
          <p className={styles.subDesc}>{result.deskripsiProd}</p>
          <CfBar
            value={result.persenProd}
            color="#48C9B0"
            label="CF Produktivitas"
          />
        </div>
      </div>

      {/* Rekomendasi */}
      <div className={styles.rekomenCard}>
        <div className={styles.rekomenHeader}>
          <span className={styles.rekomenIcon}>💡</span>
          <span className={styles.rekomenTitle}>Rekomendasi Tindak Lanjut</span>
        </div>
        <p className={styles.rekomenText}>{result.rekomendasi}</p>
      </div>

      {/* Detail Trace */}
      <details className={styles.traceDetails}>
        <summary className={styles.traceSummary}>
          <span>🔬 Lihat Detail Jejak Inferensi</span>
          <span className={styles.traceArrow}>▼</span>
        </summary>
        <div className={styles.traceBody}>
          <div className={styles.traceRow}>
            <span className={styles.traceKey}>CF Akhir (desimal)</span>
            <code className={styles.traceVal}>{result.cfKinerja.toFixed(4)}</code>
          </div>
          <div className={styles.traceRow}>
            <span className={styles.traceKey}>CF Kedisiplinan</span>
            <code className={styles.traceVal}>{result.cfKedisiplinan.toFixed(4)}</code>
          </div>
          <div className={styles.traceRow}>
            <span className={styles.traceKey}>CF Produktivitas</span>
            <code className={styles.traceVal}>{result.cfProduktivitas.toFixed(4)}</code>
          </div>
          <div className={styles.traceRow}>
            <span className={styles.traceKey}>Metode Kombinasi</span>
            <code className={styles.traceVal}>min(CF_user) × CF_pakar</code>
          </div>
          <div className={styles.traceRow}>
            <span className={styles.traceKey}>Rule Kedisiplinan</span>
            <code className={styles.traceVal}>{result.ruleKedis}</code>
          </div>
          <div className={styles.traceRow}>
            <span className={styles.traceKey}>Rule Produktivitas</span>
            <code className={styles.traceVal}>{result.ruleProd}</code>
          </div>
          <div className={styles.traceRow}>
            <span className={styles.traceKey}>Rule Kinerja</span>
            <code className={styles.traceVal}>{result.ruleKinerja}</code>
          </div>
        </div>
      </details>
    </section>
  );
};

export default HasilEvaluasi;
