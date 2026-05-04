import { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import HasilEvaluasi from './components/HasilEvaluasi';
import { hitungKinerja, INITIAL_INPUTS, INITIAL_CF } from './engine/inferensi';
import styles from './App.module.css';

function App() {
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [cfValues, setCfValues] = useState(INITIAL_CF);
  const [result, setResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    // Reset hasil saat input berubah
    setResult(null);
  };

  const handleCfChange = (cfKey, value) => {
    setCfValues((prev) => ({ ...prev, [cfKey]: value }));
    setResult(null);
  };

  const handleSubmit = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const hasil = hitungKinerja(inputs, cfValues);
      setResult(hasil);
      setIsAnimating(false);
    }, 400);
  };

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Left: Form */}
            <div className={styles.formCol}>
              <div className={styles.card}>
                <InputForm
                  inputs={inputs}
                  cfValues={cfValues}
                  onChange={handleInputChange}
                  onCfChange={handleCfChange}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            {/* Right: Hasil */}
            <div className={styles.resultCol}>
              {isAnimating && (
                <div className={styles.loadingCard}>
                  <div className={styles.spinner} />
                  <span>Memproses inferensi...</span>
                </div>
              )}

              {!isAnimating && result && (
                <div className={styles.card}>
                  <HasilEvaluasi result={result} />
                </div>
              )}

              {!isAnimating && !result && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🧠</div>
                  <h3 className={styles.emptyTitle}>Siap Mengevaluasi</h3>
                  <p className={styles.emptyText}>
                    Lengkapi data pegawai di sebelah kiri, lalu tekan{' '}
                    <strong>"Proses Evaluasi Kinerja"</strong> untuk menjalankan inferensi.
                  </p>
                  <div className={styles.emptySteps}>
                    <div className={styles.step}>
                      <span className={styles.stepNum}>1</span>
                      <span>Pilih kondisi tiap variabel</span>
                    </div>
                    <div className={styles.step}>
                      <span className={styles.stepNum}>2</span>
                      <span>Sesuaikan nilai keyakinan (CF)</span>
                    </div>
                    <div className={styles.step}>
                      <span className={styles.stepNum}>3</span>
                      <span>Tekan tombol proses</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>© 2025 Sistem Pakar Evaluasi Kinerja — AnterAja</span>
          <span className={styles.footerDivider}>·</span>
          <span>Metode: Certainty Factor + Backward Chaining</span>
          <span className={styles.footerDivider}>·</span>
          <span>Built with React + Vite</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
