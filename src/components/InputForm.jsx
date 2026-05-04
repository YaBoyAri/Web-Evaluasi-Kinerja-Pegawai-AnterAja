import styles from './InputForm.module.css';
import { FORM_CONFIG } from '../engine/inferensi';

const InputForm = ({ inputs, cfValues, onChange, onCfChange, onSubmit }) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>🔍</div>
        <div>
          <h2 className={styles.sectionTitle}>Data Evaluasi Pegawai</h2>
          <p className={styles.sectionSub}>
            Isikan kondisi aktual pegawai dan tingkat keyakinan (CF) 0.0 – 1.0
          </p>
        </div>
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      >
        <div className={styles.grid}>
          {FORM_CONFIG.map((field) => (
            <div key={field.key} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{field.icon}</span>
                <div>
                  <label htmlFor={field.key} className={styles.cardLabel}>
                    {field.label}
                  </label>
                  <p className={styles.cardDesc}>{field.description}</p>
                </div>
              </div>

              <div className={styles.cardBody}>
                {/* Radio Options */}
                <div className={styles.optionGroup}>
                  {field.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`${styles.option} ${inputs[field.key] === opt.value ? styles.optionActive : ''}`}
                    >
                      <input
                        type="radio"
                        name={field.key}
                        id={`${field.key}_${opt.value}`}
                        value={opt.value}
                        checked={inputs[field.key] === opt.value}
                        onChange={() => onChange(field.key, opt.value)}
                        className={styles.radioHidden}
                      />
                      <div className={styles.optionContent}>
                        <span className={styles.optionRadio} />
                        <div>
                          <span className={styles.optionLabel}>{opt.label}</span>
                          <span className={styles.optionSub}>{opt.sub}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* CF Slider */}
                <div className={styles.cfRow}>
                  <div className={styles.cfLabelRow}>
                    <span className={styles.cfLabel}>Tingkat Keyakinan (CF)</span>
                    <span className={styles.cfValue}>
                      {cfValues[field.cfKey].toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    id={field.cfKey}
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={cfValues[field.cfKey]}
                    onChange={(e) => onCfChange(field.cfKey, parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                  <div className={styles.sliderLabels}>
                    <span>Tidak Yakin (0.1)</span>
                    <span>Sangat Yakin (1.0)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className={styles.submitBtn} id="btn-proses-evaluasi">
          <span className={styles.btnIcon}>⚡</span>
          <span>Proses Evaluasi Kinerja</span>
          <span className={styles.btnArrow}>→</span>
        </button>
      </form>
    </section>
  );
};

export default InputForm;
