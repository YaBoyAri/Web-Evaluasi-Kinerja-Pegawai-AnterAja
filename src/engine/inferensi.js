/**
 * =============================================================
 * MESIN INFERENSI SISTEM PAKAR - CERTAINTY FACTOR (CF)
 * Evaluasi Kinerja Pegawai AnterAja
 * =============================================================
 *
 * Metode: Backward Chaining + Certainty Factor
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
  {
    ruleId: 'R22',
    cfInputs: ['cfWaktu', 'cfSop'],
    kondisi: (inp) => inp.waktu === 'Tinggi' && inp.sop === 'Ya',
    konklusi: 'Sangat Baik',
    cfPakar: 1.0,
    deskripsi: 'Ketepatan waktu tinggi dan memenuhi Standard Operating Procedure.',
  },
  {
    ruleId: 'R23',
    cfInputs: ['cfWaktu', 'cfSop'],
    kondisi: (inp) =>
      (inp.waktu === 'Tinggi' || inp.waktu === 'Sedang') && inp.sop === 'Tidak',
    konklusi: 'Kurang',
    cfPakar: 1.0,
    deskripsi: 'Ketepatan waktu tinggi/sedang tetapi tidak memenuhi Standard Operating Procedure.',
  },
  {
    ruleId: 'R24',
    cfInputs: ['cfWaktu', 'cfSop'],
    kondisi: (inp) => inp.waktu === 'Sedang' && inp.sop === 'Ya',
    konklusi: 'Baik',
    cfPakar: 0.2,
    deskripsi: 'Ketepatan waktu sedang dan memenuhi Standard Operating Procedure.',
  },
  {
    ruleId: 'R25',
    cfInputs: ['cfWaktu', 'cfSop'],
    kondisi: (inp) => inp.waktu === 'Rendah' && inp.sop === 'Ya',
    konklusi: 'Cukup',
    cfPakar: 0.8,
    deskripsi: 'Ketepatan waktu rendah namun tetap memenuhi Standard Operating Procedure.',
  },
  {
    ruleId: 'R26',
    cfInputs: ['cfWaktu', 'cfSop'],
    kondisi: (inp) => inp.waktu === 'Rendah' && inp.sop === 'Tidak',
    konklusi: 'Sangat Kurang',
    cfPakar: 1.0,
    deskripsi: 'Ketepatan waktu rendah dan tidak memenuhi Standard Operating Procedure.',
  },
];

/**
 * Set 3 - Rules Produktivitas
 * Variabel: Pencapaian KPI, Kualitas Kerja
 */
const RULES_PRODUKTIVITAS = [
  {
    ruleId: 'R27',
    cfInputs: ['cfKpi', 'cfKualitas'],
    kondisi: (inp) =>
      inp.kpi === 'Tinggi' &&
      (inp.kualitas === 'Tinggi' || inp.kualitas === 'Sedang'),
    konklusi: 'Tinggi',
    cfPakar: 1.0,
    deskripsi: 'Pencapaian KPI tinggi dengan kualitas kerja tinggi atau sedang.',
  },
  {
    ruleId: 'R28',
    cfInputs: ['cfKpi', 'cfKualitas'],
    kondisi: (inp) => inp.kpi === 'Tinggi' && inp.kualitas === 'Rendah',
    konklusi: 'Sedang',
    cfPakar: 0.5,
    deskripsi: 'Pencapaian KPI tinggi namun kualitas kerja rendah.',
  },
  {
    ruleId: 'R29',
    cfInputs: ['cfKpi', 'cfKualitas'],
    kondisi: (inp) => inp.kpi === 'Sedang' && inp.kualitas === 'Tinggi',
    konklusi: 'Tinggi',
    cfPakar: 0.7,
    deskripsi: 'Pencapaian KPI sedang dengan kualitas kerja tinggi.',
  },
  {
    ruleId: 'R30',
    cfInputs: ['cfKpi', 'cfKualitas'],
    kondisi: (inp) => inp.kpi === 'Sedang' && inp.kualitas === 'Sedang',
    konklusi: 'Sedang',
    cfPakar: 1.0,
    deskripsi: 'Pencapaian KPI sedang dengan kualitas kerja sedang.',
  },
  {
    ruleId: 'R31',
    cfInputs: ['cfKpi', 'cfKualitas'],
    kondisi: (inp) => inp.kpi === 'Sedang' && inp.kualitas === 'Rendah',
    konklusi: 'Rendah',
    cfPakar: 1.0,
    deskripsi: 'Pencapaian KPI sedang dengan kualitas kerja rendah.',
  },
  {
    ruleId: 'R32',
    cfInputs: ['cfKpi', 'cfKualitas'],
    kondisi: (inp) => inp.kpi === 'Rendah' && inp.kualitas === 'Tinggi',
    konklusi: 'Sedang',
    cfPakar: 0.8,
    deskripsi: 'Pencapaian KPI rendah tetapi kualitas kerja tinggi.',
  },
  {
    ruleId: 'R33',
    cfInputs: ['cfKpi', 'cfKualitas'],
    kondisi: (inp) =>
      inp.kpi === 'Rendah' &&
      (inp.kualitas === 'Sedang' || inp.kualitas === 'Rendah'),
    konklusi: 'Rendah',
    cfPakar: 1.0,
    deskripsi: 'Pencapaian KPI rendah dengan kualitas kerja sedang atau rendah.',
  },
];

/**
 * Set 1 - Rules Kinerja Akhir (Goal)
 * Variabel: Kedisiplinan (subgoal), Kehadiran, Produktivitas (subgoal)
 */
const RULES_KINERJA = [
  {
    ruleId: 'R1',
    premis: { kedisiplinan: 'Sangat Baik', kehadiran: 'Tinggi', produktivitas: 'Tinggi' },
    konklusi: 'Sangat Baik',
    cfPakar: 1.0,
    badge: 'excellent',
    deskripsi: 'Semua indikator utama menunjukkan performa optimal.',
    rekomendasi: 'Pertimbangkan promosi jabatan atau pemberian reward & bonus.',
  },
  {
    ruleId: 'R2',
    premis: { kedisiplinan: 'Sangat Baik', kehadiran: 'Tinggi', produktivitas: 'Sedang' },
    konklusi: 'Baik',
    cfPakar: 0.7,
    badge: 'good',
    deskripsi: 'Kinerja baik dengan peluang peningkatan produktivitas.',
    rekomendasi: 'Pertahankan konsistensi dan fokus pada peningkatan produktivitas.',
  },
  {
    ruleId: 'R3',
    premis: { kedisiplinan: 'Sangat Baik', kehadiran: 'Tinggi', produktivitas: 'Rendah' },
    konklusi: 'Cukup',
    cfPakar: 0.8,
    badge: 'average',
    deskripsi: 'Disiplin tinggi namun produktivitas perlu ditingkatkan.',
    rekomendasi: 'Berikan pendampingan peningkatan output dan kualitas kerja.',
  },
  {
    ruleId: 'R4',
    premis: { kedisiplinan: 'Sangat Baik', kehadiran: 'Rendah', produktivitas: 'Tinggi' },
    konklusi: 'Baik',
    cfPakar: 0.7,
    badge: 'good',
    deskripsi: 'Produktivitas tinggi tetapi kehadiran belum stabil.',
    rekomendasi: 'Perbaiki konsistensi kehadiran untuk menjaga performa.',
  },
  {
    ruleId: 'R5',
    premis: {
      kedisiplinan: 'Sangat Baik',
      kehadiran: 'Rendah',
      produktivitas: ['Sedang', 'Rendah'],
    },
    konklusi: 'Cukup',
    cfPakar: 0.9,
    badge: 'average',
    deskripsi: 'Kehadiran rendah menurunkan hasil akhir kinerja.',
    rekomendasi: 'Perkuat manajemen kehadiran dan monitoring kedisiplinan.',
  },
  {
    ruleId: 'R6',
    premis: {
      kedisiplinan: 'Baik',
      kehadiran: 'Tinggi',
      produktivitas: ['Tinggi', 'Sedang'],
    },
    konklusi: 'Baik',
    cfPakar: 1.0,
    badge: 'good',
    deskripsi: 'Kinerja konsisten baik pada kombinasi disiplin dan produktivitas.',
    rekomendasi: 'Pertahankan performa dan lakukan evaluasi berkala.',
  },
  {
    ruleId: 'R7',
    premis: { kedisiplinan: 'Baik', kehadiran: 'Tinggi', produktivitas: 'Rendah' },
    konklusi: 'Cukup',
    cfPakar: 0.8,
    badge: 'average',
    deskripsi: 'Kehadiran dan disiplin baik, tetapi produktivitas rendah.',
    rekomendasi: 'Fokuskan perbaikan pada pencapaian KPI dan kualitas kerja.',
  },
  {
    ruleId: 'R8',
    premis: { kedisiplinan: 'Baik', kehadiran: 'Rendah', produktivitas: 'Tinggi' },
    konklusi: 'Baik',
    cfPakar: 0.5,
    badge: 'good',
    deskripsi: 'Produktivitas tinggi menopang hasil meski kehadiran rendah.',
    rekomendasi: 'Tingkatkan kehadiran agar performa lebih stabil.',
  },
  {
    ruleId: 'R9',
    premis: { kedisiplinan: 'Baik', kehadiran: 'Rendah', produktivitas: 'Sedang' },
    konklusi: 'Cukup',
    cfPakar: 0.5,
    badge: 'average',
    deskripsi: 'Kehadiran rendah menurunkan hasil akhir kinerja.',
    rekomendasi: 'Perkuat konsistensi kehadiran dan monitoring target.',
  },
  {
    ruleId: 'R10',
    premis: { kedisiplinan: 'Baik', kehadiran: 'Rendah', produktivitas: 'Rendah' },
    konklusi: 'Kurang',
    cfPakar: 1.0,
    badge: 'poor',
    deskripsi: 'Produktivitas rendah dan kehadiran rendah menyebabkan kinerja kurang.',
    rekomendasi: 'Lakukan pembinaan intensif dan target perbaikan terukur.',
  },
  {
    ruleId: 'R11',
    premis: { kedisiplinan: 'Cukup', kehadiran: 'Tinggi', produktivitas: 'Tinggi' },
    konklusi: 'Baik',
    cfPakar: 0.7,
    badge: 'good',
    deskripsi: 'Produktivitas tinggi meningkatkan hasil akhir kinerja.',
    rekomendasi: 'Pertahankan produktivitas sambil memperkuat kedisiplinan.',
  },
  {
    ruleId: 'R12',
    premis: {
      kedisiplinan: 'Cukup',
      kehadiran: 'Tinggi',
      produktivitas: ['Sedang', 'Rendah'],
    },
    konklusi: 'Cukup',
    cfPakar: 0.8,
    badge: 'average',
    deskripsi: 'Kinerja cukup dengan kebutuhan perbaikan pada produktivitas.',
    rekomendasi: 'Lakukan pengembangan kompetensi sesuai kebutuhan kerja.',
  },
  {
    ruleId: 'R13',
    premis: { kedisiplinan: 'Cukup', kehadiran: 'Rendah', produktivitas: 'Tinggi' },
    konklusi: 'Cukup',
    cfPakar: 0.8,
    badge: 'average',
    deskripsi: 'Produktivitas tinggi belum cukup menutup dampak kehadiran rendah.',
    rekomendasi: 'Perbaiki disiplin kehadiran untuk menjaga stabilitas performa.',
  },
  {
    ruleId: 'R14',
    premis: {
      kedisiplinan: 'Cukup',
      kehadiran: 'Rendah',
      produktivitas: ['Sedang', 'Rendah'],
    },
    konklusi: 'Kurang',
    cfPakar: 1.0,
    badge: 'poor',
    deskripsi: 'Kehadiran rendah dan produktivitas belum memadai.',
    rekomendasi: 'Perlu pembinaan dan pemantauan ketat dari atasan langsung.',
  },
  {
    ruleId: 'R15',
    premis: { kedisiplinan: 'Kurang', kehadiran: 'Tinggi', produktivitas: 'Tinggi' },
    konklusi: 'Cukup',
    cfPakar: 0.7,
    badge: 'average',
    deskripsi: 'Produktivitas tinggi menahan penurunan akibat kedisiplinan kurang.',
    rekomendasi: 'Fokus pada perbaikan kedisiplinan kerja dan kepatuhan aturan.',
  },
  {
    ruleId: 'R16',
    premis: {
      kedisiplinan: 'Kurang',
      kehadiran: 'Tinggi',
      produktivitas: ['Sedang', 'Rendah'],
    },
    konklusi: 'Kurang',
    cfPakar: 1.0,
    badge: 'poor',
    deskripsi: 'Kedisiplinan kurang dengan produktivitas belum optimal.',
    rekomendasi: 'Terapkan rencana perbaikan kinerja dengan evaluasi periodik.',
  },
  {
    ruleId: 'R17',
    premis: { kedisiplinan: 'Kurang', kehadiran: 'Rendah', produktivitas: 'Tinggi' },
    konklusi: 'Kurang',
    cfPakar: 0.5,
    badge: 'poor',
    deskripsi: 'Kehadiran rendah memperburuk hasil akhir walau produktivitas tinggi.',
    rekomendasi: 'Prioritaskan perbaikan kehadiran dan komitmen kerja.',
  },
  {
    ruleId: 'R18',
    premis: {
      kedisiplinan: 'Kurang',
      kehadiran: 'Rendah',
      produktivitas: ['Sedang', 'Rendah'],
    },
    konklusi: 'Sangat Kurang',
    cfPakar: 1.0,
    badge: 'poor',
    deskripsi: 'Mayoritas indikator berada pada kondisi lemah.',
    rekomendasi: 'Perlu tindakan korektif segera dan evaluasi lanjutan.',
  },
  {
    ruleId: 'R19',
    premis: { kedisiplinan: 'Sangat Kurang', kehadiran: 'Tinggi', produktivitas: 'Tinggi' },
    konklusi: 'Kurang',
    cfPakar: 1.0,
    badge: 'poor',
    deskripsi: 'Produktivitas tinggi belum mampu menutup kedisiplinan sangat kurang.',
    rekomendasi: 'Lakukan pembinaan intensif pada aspek disiplin kerja.',
  },
  {
    ruleId: 'R20',
    premis: {
      kedisiplinan: 'Sangat Kurang',
      kehadiran: 'Tinggi',
      produktivitas: ['Sedang', 'Rendah'],
    },
    konklusi: 'Sangat Kurang',
    cfPakar: 1.0,
    badge: 'poor',
    deskripsi: 'Kinerja sangat kurang pada kombinasi disiplin dan produktivitas.',
    rekomendasi: 'Terapkan tindakan pembinaan formal bersama tim HR.',
  },
  {
    ruleId: 'R21',
    premis: {
      kedisiplinan: 'Sangat Kurang',
      kehadiran: 'Rendah',
      produktivitas: ['Tinggi', 'Sedang', 'Rendah'],
    },
    konklusi: 'Sangat Kurang',
    cfPakar: 1.0,
    badge: 'poor',
    deskripsi: 'Kombinasi kedisiplinan sangat kurang dan kehadiran rendah.',
    rekomendasi: 'Perlu evaluasi menyeluruh dan tindakan korektif segera.',
  },
];

// -------------------------------------------------------
// FUNGSI MESIN INFERENSI
// -------------------------------------------------------

function nilaiSesuai(target, nilaiAktual) {
  return Array.isArray(target) ? target.includes(nilaiAktual) : target === nilaiAktual;
}

function buktikanSubgoal(rules, targetKonklusi, inputs, cfValues) {
  for (const rule of rules) {
    if (!nilaiSesuai(targetKonklusi, rule.konklusi)) {
      continue;
    }

    if (!rule.kondisi(inputs)) {
      continue;
    }

    const cfUser = Math.min(...rule.cfInputs.map((key) => cfValues[key]));
    const cfGabungan = cfUser * rule.cfPakar;
    return {
      ruleId: rule.ruleId,
      konklusi: rule.konklusi,
      cfPakar: rule.cfPakar,
      cfUser,
      cfGabungan,
      deskripsi: rule.deskripsi,
    };
  }

  return null;
}

function buktikanKinerja(inputs, cfValues) {
  for (const rule of RULES_KINERJA) {
    const kedisiplinanTerbukti = buktikanSubgoal(
      RULES_KEDISIPLINAN,
      rule.premis.kedisiplinan,
      inputs,
      cfValues
    );
    if (!kedisiplinanTerbukti) {
      continue;
    }

    if (!nilaiSesuai(rule.premis.kehadiran, inputs.kehadiran)) {
      continue;
    }

    const produktivitasTerbukti = buktikanSubgoal(
      RULES_PRODUKTIVITAS,
      rule.premis.produktivitas,
      inputs,
      cfValues
    );
    if (!produktivitasTerbukti) {
      continue;
    }

    const cfUser = Math.min(
      kedisiplinanTerbukti.cfGabungan,
      cfValues.cfKehadiran,
      produktivitasTerbukti.cfGabungan
    );
    const cfGabungan = cfUser * rule.cfPakar;

    return {
      kinerja: {
        ruleId: rule.ruleId,
        konklusi: rule.konklusi,
        cfPakar: rule.cfPakar,
        cfUser,
        cfGabungan,
        badge: rule.badge || null,
        deskripsi: rule.deskripsi,
        rekomendasi: rule.rekomendasi || null,
      },
      kedisiplinan: kedisiplinanTerbukti,
      produktivitas: produktivitasTerbukti,
    };
  }

  return null;
}

/**
 * Fungsi utama inferensi sistem pakar
 * @param {Object} inputs - Pilihan user (waktu, sop, kehadiran, kpi, kualitas)
 * @param {Object} cfValues - Nilai CF dari user (cfWaktu, cfSop, cfKehadiran, cfKpi, cfKualitas)
 * @returns {Object} hasil lengkap inferensi
 */
export function hitungKinerja(inputs, cfValues) {
  const hasilPembuktian = buktikanKinerja(inputs, cfValues);
  if (!hasilPembuktian) {
    throw new Error('Tidak ada rule yang cocok untuk kombinasi input saat ini.');
  }

  const hasilKinerja = hasilPembuktian.kinerja;
  const hasilKedis = hasilPembuktian.kedisiplinan;
  const hasilProd = hasilPembuktian.produktivitas;

  return {
    kinerja: hasilKinerja.konklusi,
    cfKinerja: hasilKinerja.cfGabungan,
    badge: hasilKinerja.badge,
    deskripsiKinerja: hasilKinerja.deskripsi,
    rekomendasi: hasilKinerja.rekomendasi,
    ruleKinerja: hasilKinerja.ruleId,

    kedisiplinan: hasilKedis.konklusi,
    cfKedisiplinan: hasilKedis.cfGabungan,
    ruleKedis: hasilKedis.ruleId,
    deskripsiKedis: hasilKedis.deskripsi,

    produktivitas: hasilProd.konklusi,
    cfProduktivitas: hasilProd.cfGabungan,
    ruleProd: hasilProd.ruleId,
    deskripsiProd: hasilProd.deskripsi,

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
