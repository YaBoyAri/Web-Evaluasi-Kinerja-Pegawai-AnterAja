# Sistem Pakar Evaluasi Kinerja Pegawai AnterAja

> Sistem Pakar berbasis **Certainty Factor (CF)** dengan Backward Chaining untuk evaluasi kinerja pegawai kurir AnterAja.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🧠 Tentang Proyek

Aplikasi web ini mengimplementasikan metode **Certainty Factor (CF)** untuk melakukan evaluasi kinerja pegawai secara objektif berdasarkan 5 variabel input utama:

| Variabel | Set Rule | Keterangan |
|---|---|---|
| Ketepatan Waktu | Set 2 | Subgoal Kedisiplinan |
| Kepatuhan SOP | Set 2 | Subgoal Kedisiplinan |
| Kehadiran | Set 1 | Goal Kinerja Akhir |
| Pencapaian KPI | Set 3 | Subgoal Produktivitas |
| Kualitas Kerja | Set 3 | Subgoal Produktivitas |

## ⚙️ Struktur Inferensi

```
Inputs
  ├── Set 2 → Kedisiplinan (R22–R26)
  ├── Set 3 → Produktivitas (R27–R33)
  └── Set 1 (Goal) → Kinerja Akhir (R1–R14)
              ↑ menggunakan hasil Set 2 & Set 3
```

**Formula CF:**
```
CF_gabungan = min(CF_user₁, CF_user₂, ...) × CF_pakar
```

## 🚀 Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

## 📦 Build untuk Production

```bash
npm run build
```


## 🗂️ Struktur Folder

```
src/
├── engine/
│   └── inferensi.js      # Mesin inferensi CF + basis pengetahuan
├── components/
│   ├── Header.jsx         # Hero header
│   ├── Header.module.css
│   ├── InputForm.jsx      # Form input 5 variabel + CF slider
│   ├── InputForm.module.css
│   ├── HasilEvaluasi.jsx  # Tampilan hasil + detail inferensi
│   └── HasilEvaluasi.module.css
├── App.jsx
├── App.module.css
├── index.css              # Design system global
└── main.jsx
```

## 🛠️ Tech Stack

- **React 19** + **Vite 6**
- **CSS Modules** (Vanilla CSS, no framework)
- **Google Fonts** (Inter)
- Deploy: **Vercel**
