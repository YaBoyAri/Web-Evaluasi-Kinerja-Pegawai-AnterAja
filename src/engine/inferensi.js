/**
 * =============================================================
 * MESIN INFERENSI SISTEM PAKAR - CERTAINTY FACTOR (CF)
 * Evaluasi Kinerja Pegawai AnterAja
 * =============================================================
 *
 * Metode: Forward Chaining + Certainty Factor
 * CF Gabungan: CF_combined = CF_user * CF_pakar
 * Kombinasi AND: min(CF1, CF2, ...)
 *
 * STRUKTUR RULES:
 *  Set 1 (Goal)    : Kinerja Akhir Pegawai
 *  Set 2 (Subgoal) : Kedisiplinan Pegawai
 *  Set 3 (Subgoal) : Produktivitas Pegawai
 * =============================================================
 */

// -------------------------------------------------------
// DEFINISI RULES LENGKAP (Basis Pengetahuan)
// -------------------------------------------------------

/**
 * Set 2 - Rules Kedisiplinan
 * Variabel: Ketepatan Waktu, Memenuhi SOP
 */
const RULES_KEDISIPLINAN = [
  // Rule 22: Waktu Tinggi + SOP Ya → Kedisiplinan Sangat Baik
  {
    ruleId: 'R22',
    kondisi: (inp) => inp.waktu === 'Tinggi' && inp.sop === 'Ya',
    konklusi: 'Sangat Baik',
    cfPakar: 1.0,
    deskripsi: 'Tepat waktu selalu & mematuhi SOP penuh',
  },
  // Rule 23: Waktu Sedang + SOP Ya → Kedisiplinan Baik
  {
    ruleId: 'R23',
    kondisi: (inp) => inp.waktu === 'Sedang' && inp.sop === 'Ya',
    konklusi: 'Baik',
    cfPakar: 0.9,
    deskripsi: 'Terlambat sesekali namun mematuhi SOP',
  },
  // Rule 24: Waktu Tinggi + SOP Tidak → Kedisiplinan Cukup
  {
    ruleId: 'R24',
    kondisi: (inp) => inp.waktu === 'Tinggi' && inp.sop === 'Tidak',
    konklusi: 'Cukup',
    cfPakar: 0.8,
    deskripsi: 'Tepat waktu namun tidak mengikuti SOP',
  },
  // Rule 25: Waktu Rendah + SOP Ya → Kedisiplinan Cukup
  {
    ruleId: 'R25',
    kondisi: (inp) => inp.waktu === 'Rendah' && inp.sop === 'Ya',
    konklusi: 'Cukup',
    cfPakar: 0.8,
    deskripsi: 'Sering terlambat namun mematuhi SOP',
  },
  // Rule 26: Waktu Rendah + SOP Tidak → Kedisiplinan Kurang
  {
    ruleId: 'R26',
    kondisi: (inp) => inp.waktu === 'Rendah' && inp.sop === 'Tidak',
    konklusi: 'Kurang',
    cfPakar: 0.9,
    deskripsi: 'Sering terlambat dan tidak mengikuti SOP',
  },
  // Default: Sedang
  {
    ruleId: 'R_DEFAULT_KEDIS',
    kondisi: () => true,
    konklusi: 'Sedang',
    cfPakar: 0.6,
    deskripsi: 'Kondisi disiplin tidak terpetakan ke rule utama',
  },
];

/**
 * Set 3 - Rules Produktivitas
 * Variabel: Pencapaian KPI, Kualitas Kerja
 */
const RULES_PRODUKTIVITAS = [
  // Rule 27: KPI Tinggi + Kualitas Tinggi/Sedang → Produktivitas Tinggi
  {
    ruleId: 'R27',
    kondisi: (inp) =>
      inp.kpi === 'Tinggi' &&
      (inp.kualitas === 'Tinggi' || inp.kualitas === 'Sedang'),
    konklusi: 'Tinggi',
    cfPakar: 1.0,
    deskripsi: 'KPI tercapai ≥90% dengan kualitas kerja baik',
  },
  // Rule 28: KPI Sedang + Kualitas Tinggi → Produktivitas Tinggi
  {
    ruleId: 'R28',
    kondisi: (inp) => inp.kpi === 'Sedang' && inp.kualitas === 'Tinggi',
    konklusi: 'Tinggi',
    cfPakar: 0.85,
    deskripsi: 'KPI cukup dengan kualitas kerja sangat baik',
  },
  // Rule 29: KPI Sedang + Kualitas Sedang → Produktivitas Sedang
  {
    ruleId: 'R29',
    kondisi: (inp) => inp.kpi === 'Sedang' && inp.kualitas === 'Sedang',
    konklusi: 'Sedang',
    cfPakar: 0.8,
    deskripsi: 'KPI dan kualitas cukup memadai',
  },
  // Rule 30: KPI Tinggi + Kualitas Rendah → Produktivitas Sedang
  {
    ruleId: 'R30',
    kondisi: (inp) => inp.kpi === 'Tinggi' && inp.kualitas === 'Rendah',
    konklusi: 'Sedang',
    cfPakar: 0.75,
    deskripsi: 'KPI tinggi namun kualitas kerja perlu ditingkatkan',
  },
  // Rule 33: KPI Rendah → Produktivitas Rendah
  {
    ruleId: 'R33',
    kondisi: (inp) => inp.kpi === 'Rendah',
    konklusi: 'Rendah',
    cfPakar: 1.0,
    deskripsi: 'Pencapaian KPI di bawah standar (<70%)',
  },
  // Default
  {
    ruleId: 'R_DEFAULT_PROD',
    kondisi: () => true,
    konklusi: 'Sedang',
    cfPakar: 0.5,
    deskripsi: 'Produktivitas tidak terpetakan ke rule utama',
  },
];

/**
 * Set 1 - Rules Kinerja Akhir (Goal)
 * Variabel: Kedisiplinan (subgoal), Kehadiran, Produktivitas (subgoal)
 */
const RULES_KINERJA = [
  // Rule 1: Sangat Baik + Kehadiran Tinggi + Produktivitas Tinggi → Kinerja Sangat Baik
  {
    ruleId: 'R1',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Sangat Baik' && kehadiran === 'Tinggi' && prod === 'Tinggi',
    konklusi: 'Sangat Baik',
    cfPakar: 1.0,
    badge: 'excellent',
    deskripsi: 'Karyawan berkinerja luar biasa di semua aspek',
    rekomendasi: 'Pertimbangkan promosi jabatan atau pemberian reward & bonus.',
  },
  // Rule 2: Baik + Kehadiran Tinggi + Produktivitas Tinggi → Kinerja Sangat Baik
  {
    ruleId: 'R2',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Baik' && kehadiran === 'Tinggi' && prod === 'Tinggi',
    konklusi: 'Sangat Baik',
    cfPakar: 0.95,
    badge: 'excellent',
    deskripsi: 'Karyawan berkinerja sangat baik dengan konsistensi tinggi',
    rekomendasi: 'Pertimbangkan pengembangan karier dan tanggung jawab lebih besar.',
  },
  // Rule 3: Sangat Baik + Kehadiran Tinggi + Produktivitas Sedang → Kinerja Baik
  {
    ruleId: 'R3',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Sangat Baik' && kehadiran === 'Tinggi' && prod === 'Sedang',
    konklusi: 'Baik',
    cfPakar: 0.9,
    badge: 'good',
    deskripsi: 'Disiplin dan kehadiran prima, produktivitas cukup baik',
    rekomendasi: 'Berikan pelatihan peningkatan produktivitas dan pencapaian KPI.',
  },
  // Rule 4: Baik + Kehadiran Tinggi + Produktivitas Sedang → Kinerja Baik
  {
    ruleId: 'R4',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Baik' && kehadiran === 'Tinggi' && prod === 'Sedang',
    konklusi: 'Baik',
    cfPakar: 0.85,
    badge: 'good',
    deskripsi: 'Disiplin baik dengan produktivitas yang memadai',
    rekomendasi: 'Berikan target yang lebih jelas untuk meningkatkan produktivitas.',
  },
  // Rule 5: Cukup + Kehadiran Tinggi + Produktivitas Tinggi → Kinerja Baik
  {
    ruleId: 'R5',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Cukup' && kehadiran === 'Tinggi' && prod === 'Tinggi',
    konklusi: 'Baik',
    cfPakar: 0.85,
    badge: 'good',
    deskripsi: 'Produktivitas tinggi mengimbangi disiplin yang kurang optimal',
    rekomendasi: 'Lakukan pembinaan khusus pada aspek kedisiplinan dan kepatuhan SOP.',
  },
  // Rule 6-9: Kinerja Cukup berbagai kombinasi
  {
    ruleId: 'R6',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Cukup' && kehadiran === 'Tinggi' && prod === 'Sedang',
    konklusi: 'Cukup',
    cfPakar: 0.8,
    badge: 'average',
    deskripsi: 'Kinerja cukup dengan beberapa area yang perlu ditingkatkan',
    rekomendasi: 'Buat rencana pengembangan individu (IDP) untuk 3 bulan ke depan.',
  },
  {
    ruleId: 'R7',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Sangat Baik' && kehadiran === 'Rendah' && prod === 'Tinggi',
    konklusi: 'Cukup',
    cfPakar: 0.75,
    badge: 'average',
    deskripsi: 'Produktivitas dan disiplin baik namun kehadiran rendah',
    rekomendasi: 'Evaluasi kehadiran dan berikan coaching terkait komitmen kerja.',
  },
  {
    ruleId: 'R8',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Baik' && kehadiran === 'Rendah' && prod === 'Sedang',
    konklusi: 'Cukup',
    cfPakar: 0.7,
    badge: 'average',
    deskripsi: 'Performa cukup namun kehadiran perlu diperbaiki',
    rekomendasi: 'Terapkan sistem monitoring kehadiran dan berikan peringatan formal.',
  },
  {
    ruleId: 'R9',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Cukup' && kehadiran === 'Rendah' && prod === 'Tinggi',
    konklusi: 'Cukup',
    cfPakar: 0.7,
    badge: 'average',
    deskripsi: 'Produktivitas tinggi tidak diimbangi kehadiran dan disiplin',
    rekomendasi: 'Lakukan evaluasi menyeluruh dan buat kesepakatan target perbaikan.',
  },
  // Rule Kurang
  {
    ruleId: 'R10',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Kurang' && kehadiran === 'Rendah' && prod === 'Rendah',
    konklusi: 'Kurang',
    cfPakar: 1.0,
    badge: 'poor',
    deskripsi: 'Semua aspek kinerja di bawah standar minimal',
    rekomendasi: 'Berikan Surat Peringatan (SP) dan tetapkan masa evaluasi 30 hari.',
  },
  {
    ruleId: 'R11',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Kurang' && kehadiran === 'Rendah' && prod === 'Sedang',
    konklusi: 'Kurang',
    cfPakar: 0.9,
    badge: 'poor',
    deskripsi: 'Disiplin dan kehadiran buruk meski produktivitas sedang',
    rekomendasi: 'Lakukan pembinaan intensif dan evaluasi kembali dalam 30 hari.',
  },
  {
    ruleId: 'R14',
    kondisi: (kedis, kehadiran, prod) =>
      kedis === 'Cukup' && kehadiran === 'Rendah' && prod === 'Rendah',
    konklusi: 'Kurang',
    cfPakar: 1.0,
    badge: 'poor',
    deskripsi: 'Kombinasi produktivitas rendah dan kehadiran buruk',
    rekomendasi: 'Penanganan HR diperlukan, pertimbangkan penempatan ulang posisi.',
  },
  // Default
  {
    ruleId: 'R_DEFAULT_KINERJA',
    kondisi: () => true,
    konklusi: 'Cukup',
    cfPakar: 0.5,
    badge: 'average',
    deskripsi: 'Kinerja belum terpetakan ke rule spesifik, evaluasi manual diperlukan',
    rekomendasi: 'Lakukan wawancara evaluasi kinerja dengan atasan langsung.',
  },
];

// -------------------------------------------------------
// FUNGSI MESIN INFERENSI
// -------------------------------------------------------

/**
 * Menjalankan satu set rules dan mengembalikan hasil pertama yang cocok
 * CF Gabungan = min(cfUser...) * cfPakar
 */
function jalankanRules(rules, kondisiArgs, cfUserValues) {
  for (const rule of rules) {
    const cocok = Array.isArray(kondisiArgs)
      ? rule.kondisi(...kondisiArgs)
      : rule.kondisi(kondisiArgs);

    if (cocok) {
      const cfUser = Math.min(...cfUserValues);
      const cfGabungan = cfUser * rule.cfPakar;
      return {
        ruleId: rule.ruleId,
        konklusi: rule.konklusi,
        cfPakar: rule.cfPakar,
        cfUser: cfUser,
        cfGabungan: cfGabungan,
        deskripsi: rule.deskripsi,
        badge: rule.badge || null,
        rekomendasi: rule.rekomendasi || null,
      };
    }
  }
  return null; // Should never reach here because of default rule
}

/**
 * Fungsi utama inferensi sistem pakar
 * @param {Object} inputs - Pilihan user (waktu, sop, kehadiran, kpi, kualitas)
 * @param {Object} cfValues - Nilai CF dari user (cfWaktu, cfSop, cfKehadiran, cfKpi, cfKualitas)
 * @returns {Object} hasil lengkap inferensi
 */
export function hitungKinerja(inputs, cfValues) {
  // --------------------------------------------------------
  // FASE 1: Inferensi Kedisiplinan (Subgoal - Set 2)
  // --------------------------------------------------------
  const hasilKedis = jalankanRules(
    RULES_KEDISIPLINAN,
    inputs,
    [cfValues.cfWaktu, cfValues.cfSop]
  );

  // --------------------------------------------------------
  // FASE 2: Inferensi Produktivitas (Subgoal - Set 3)
  // --------------------------------------------------------
  const hasilProd = jalankanRules(
    RULES_PRODUKTIVITAS,
    inputs,
    [cfValues.cfKpi, cfValues.cfKualitas]
  );

  // --------------------------------------------------------
  // FASE 3: Inferensi Kinerja Akhir (Goal - Set 1)
  // Menggunakan hasil subgoal sebagai input
  // --------------------------------------------------------
  const hasilKinerja = jalankanRules(
    RULES_KINERJA,
    [hasilKedis.konklusi, inputs.kehadiran, hasilProd.konklusi],
    [hasilKedis.cfGabungan, cfValues.cfKehadiran, hasilProd.cfGabungan]
  );

  return {
    // Hasil Akhir
    kinerja: hasilKinerja.konklusi,
    cfKinerja: hasilKinerja.cfGabungan,
    badge: hasilKinerja.badge,
    deskripsiKinerja: hasilKinerja.deskripsi,
    rekomendasi: hasilKinerja.rekomendasi,
    ruleKinerja: hasilKinerja.ruleId,

    // Subgoal: Kedisiplinan
    kedisiplinan: hasilKedis.konklusi,
    cfKedisiplinan: hasilKedis.cfGabungan,
    ruleKedis: hasilKedis.ruleId,
    deskripsiKedis: hasilKedis.deskripsi,

    // Subgoal: Produktivitas
    produktivitas: hasilProd.konklusi,
    cfProduktivitas: hasilProd.cfGabungan,
    ruleProd: hasilProd.ruleId,
    deskripsiProd: hasilProd.deskripsi,

    // Persentase untuk UI
    persenKinerja: Math.round(hasilKinerja.cfGabungan * 100),
    persenKedis: Math.round(hasilKedis.cfGabungan * 100),
    persenProd: Math.round(hasilProd.cfGabungan * 100),
  };
}

// -------------------------------------------------------
// KONSTANTA KONFIGURASI FORM
// -------------------------------------------------------
export const FORM_CONFIG = [
  {
    key: 'waktu',
    cfKey: 'cfWaktu',
    label: 'Ketepatan Waktu',
    icon: '⏱️',
    description: 'Tingkat ketepatan waktu tiba di tempat kerja',
    options: [
      { value: 'Tinggi', label: 'Tinggi', sub: '≤ 30 menit keterlambatan/bulan' },
      { value: 'Sedang', label: 'Sedang', sub: '≤ 60 menit keterlambatan/bulan' },
      { value: 'Rendah', label: 'Rendah', sub: '> 60 menit keterlambatan/bulan' },
    ],
  },
  {
    key: 'sop',
    cfKey: 'cfSop',
    label: 'Kepatuhan SOP',
    icon: '📋',
    description: 'Tingkat kepatuhan terhadap Standard Operating Procedure',
    options: [
      { value: 'Ya', label: 'Mematuhi SOP', sub: 'Mengikuti prosedur yang ditetapkan' },
      { value: 'Tidak', label: 'Tidak Mematuhi', sub: 'Sering mengabaikan prosedur' },
    ],
  },
  {
    key: 'kehadiran',
    cfKey: 'cfKehadiran',
    label: 'Tingkat Kehadiran',
    icon: '📅',
    description: 'Jumlah hari absen dalam satu bulan',
    options: [
      { value: 'Tinggi', label: 'Tinggi', sub: '≤ 3 kali absen/bulan' },
      { value: 'Rendah', label: 'Rendah', sub: '> 3 kali absen/bulan' },
    ],
  },
  {
    key: 'kpi',
    cfKey: 'cfKpi',
    label: 'Pencapaian KPI',
    icon: '📊',
    description: 'Persentase pencapaian Key Performance Indicator',
    options: [
      { value: 'Tinggi', label: 'Tinggi', sub: '≥ 90% target tercapai' },
      { value: 'Sedang', label: 'Sedang', sub: '70% – 89% target tercapai' },
      { value: 'Rendah', label: 'Rendah', sub: '< 70% target tercapai' },
    ],
  },
  {
    key: 'kualitas',
    cfKey: 'cfKualitas',
    label: 'Kualitas Kerja',
    icon: '⭐',
    description: 'Tingkat kualitas hasil pekerjaan yang diselesaikan',
    options: [
      { value: 'Tinggi', label: 'Tinggi', sub: 'Sangat baik, minim revisi' },
      { value: 'Sedang', label: 'Sedang', sub: 'Cukup baik, revisi minor' },
      { value: 'Rendah', label: 'Rendah', sub: 'Banyak revisi diperlukan' },
    ],
  },
];

export const INITIAL_INPUTS = {
  waktu: 'Tinggi',
  sop: 'Ya',
  kehadiran: 'Tinggi',
  kpi: 'Tinggi',
  kualitas: 'Sedang',
};

export const INITIAL_CF = {
  cfWaktu: 0.9,
  cfSop: 0.8,
  cfKehadiran: 0.9,
  cfKpi: 0.85,
  cfKualitas: 0.75,
};
