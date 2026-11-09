# SIM-KARTANI BIAK NUMFOR
### Sistem Informasi Manajemen Kartu Tani OAP (Orang Asli Papua) & Integrasi Layanan Transportasi DAMRI
**Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor**

[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-blue.svg)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Dana Otsus](https://img.shields.io/badge/Program-Otonomi_Khusus_Papua_2026-orange.svg)](#)

---

## 📌 1. Latar Belakang & Deskripsi Proyek

Kabupaten Biak Numfor menyelenggarakan program bantuan **Otonomi Khusus (Otsus)** di bidang pertanian yang dikelola oleh **Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor**. Salah satu wujud bantuan strategis adalah **Kartu Tani OAP** yang berfungsi ganda:
1. **Identitas Digital & Administrasi Bantuan**: Mengelola basis data **500 Petani Orang Asli Papua (OAP)** penerima bantuan Otsus secara terintegrasi (menghilangkan pendataan manual Word/Excel dan duplikasi).
2. **Fasilitasi Transportasi Pascapanen (DAMRI)**: Mendukung pengangkutan komoditas hasil pertanian (Keladi Biak, Ubi Jalar/Petatas, Kasbi/Singkong, Sayur Lilin) dari sentra produksi (kampung-kampung di 10 distrik) menuju pasar distribusi (**Pasar Tani Fandoi, Pasar Darfuar, Pasar Bosnik**) menggunakan armada DAMRI dengan verifikasi **QR Code realtime**.

Aplikasi ini dikembangkan berdasarkan spesifikasi resmi:
- *Dokumen Kebutuhan Rancang Bangun Sistem Informasi Kartu Tani OAP (No. 400.10.5/205/IX/DISTAN/2026)* ditandatangani oleh Plt. Kepala Dinas Pertanian Kab. Biak Numfor **drh. BAMBANG HAYANTO**.
- *Proposal Tugas Akhir*: **Dian Violin Kapisa (NIM: 202304560051)**, Program Studi Sistem Informasi, Universitas Katolik Indonesia Atma Jaya Jakarta.
- *Diagram Use Case & Activity Diagram*: Alur Administrasi Kartu Tani & Penggunaan Kartu Transportasi DAMRI.
- *Data Riil Petani*: 500 Data Petani Penerima Kartu Tani Kabupaten Biak Numfor Tahun 2026.

---

## ✨ 2. Fitur & Modul Utama Sistem

### A. Otentikasi & Multi-Role Berjenjang (RBAC)
- **Admin Dinas**: Manajemen master data (petani, kelompok tani, distrik, kampung), kelola user, monitoring jejak audit (*Audit Trail*), ekspor rekapitulasi.
- **Petugas Lapangan (PPL / Verifikator)**: Input calon penerima, verifikasi berkas dan kondisi fisik lahan kebun.
- **Pimpinan (Kepala Dinas / Kepala Bidang)**: Menetapkan status penerima bantuan Otsus (*Ditetapkan* / *Ditolak*), otorisasi penerbitan kartu, dashboard eksekutif.
- **Petugas DAMRI (Operator / Supir)**: Pemindai QR Code via kamera ponsel/laptop, validasi status kartu aktif, input manifest muatan (pasar tujuan, komoditas, volume Kg, nomor armada).
- **Petani OAP (Penerima Manfaat)**: Portal petani digital mandiri menampilkan Kartu Tani OAP ber-QR Code, riwayat bantuan Otsus, dan riwayat angkutan DAMRI.

### B. Pengelolaan Data Petani OAP (500 Data Riil)
- Pencarian cerdas, filter berdasarkan **10 Distrik** (*Andey, Biak Barat, Biak Timur, Biak Utara, Bondifuar, Oridek, Samofa, Swandiwe, Warsa, Yendidori*), dan status verifikasi.
- Nomor Kartu Tani Unik: `KT-OAP-2026-XXXX`.
- Paginasi data yang responsif dan cepat.

### C. Penerbitan & Cetak Kartu Tani OAP
- **Kartu Tani Digital**: Tampilan kartu resmi standar ISO ID-1 berlatar hijau zamrud hutan Papua dengan aksen emas dan watermark resmi.
- **QR Code Unik**: Berisi tanda tangan token kriptografis untuk validasi tanpa mengekspos data pribadi sensitif secara bebas.
- **Cetak Fisik**: Fitur cetak satuan dan **Cetak Massal (Batch Print)** siap potong pada kertas lembar A4 / ID Card.

### D. Layanan Transportasi DAMRI & Scanner QR Code
- Pemindaian real-time kamera HTML5 (*HTML5-QRCode*) dengan dukungan ganti kamera depan/belakang dan upload gambar.
- Fitur verifikasi manual (input nomor kartu / NIK) jika kamera tidak tersedia.
- Respon validasi instan:
  - **VALID (Hijau)**: Menampilkan profil petani dan mengaktifkan form pengangkutan hasil panen.
  - **AKSES DITOLAK (Merah)**: Penolakan otomatis jika kartu belum disetujui / dinonaktifkan.
- Pencatatan manifest angkutan hasil panen (titik asal, pasar tujuan, berat dalam Kg, armada DAMRI).

### E. Program Bantuan & Penyaluran Otsus
- Master program bantuan (Subsidi Angkutan DAMRI, Bibit Keladi Unggul, Pupuk Organik & NPK, Alsintan Hand Traktor, Sarana Pascapanen).
- Pencatatan kronologis penerima bantuan dan nilai realisasi.

### F. Dashboard Eksekutif & Visualisasi Data
- Kartu KPI Ringkasan: Total Petani, Petani Ditetapkan, Antrean Verifikasi, Total Trip DAMRI, Total Tonase Terangkut (Kg), Program Otsus.
- Grafik Interaktif (*Chart.js*):
  - Grafik Batang: Sebaran Petani di 10 Distrik Biak Numfor.
  - Grafik Donat: Proporsi Komoditas Pangan Unggulan.

### G. Laporan Resmi & Ekspor Data
- Laporan Rekapitulasi Petani Penerima Kartu Tani OAP (Kop Surat Dinas, tanda tangan pejabat, siap cetak).
- Laporan Operasional Angkutan DAMRI.
- Laporan Kronologis Penyaluran Bantuan Otsus.
- Ekspor berkas format **CSV / Excel** untuk pengolahan lebih lanjut.

---

## 🛠️ 3. Arsitektur Teknologi

- **Backend**: Node.js (v22 LTS)
- **Web Framework**: Express.js
- **Basis Data**: MySQL (Database engine InnoDB, Foreign Key integrity)
- **Frontend / Templating**: Modern EJS-compatible view engine, Tailwind CSS, Bootstrap Icons
- **Keamanan**: Password Hashing berbasis `scrypt` kriptografis, Cookie Sesi bertanda tangan HMAC-SHA256, Audit Trail Logging.
- **Visualisasi & Scanner**: Chart.js, HTML5-QRCode Scanner, QRCode Generator.

---

## 📂 4. Struktur Direktori Proyek

```
dinas-pertanian/
├── database/
│   ├── schema.sql           # Skema lengkap seluruh tabel MySQL
│   ├── seed.js              # Seeder otomatis 500 petani, user, poktan, bantuan, damri
│   └── farmers_data.json    # Ekstraksi 500 petani riil dari berkas Excel
├── docs/
│   ├── ARSITEKTUR_SISTEM.md # Dokumen arsitektur, RBAC, dan alur kerja (Mermaid)
│   ├── PERANCANGAN_DATABASE.md # ERD dan kamus data
│   ├── PANDUAN_PENGGUNA.md  # Panduan skenario operasional pengujian
│   └── API_DOCUMENTATION.md # Spesifikasi REST API integrasi DAMRI
├── public/
│   ├── img/                 # Gambar dan placeholder logo/avatar
│   └── uploads/qrcodes/     # Berkas citra QR Code kartu tani
├── src/
│   ├── config/              # Konfigurasi koneksi MySQL pool
│   ├── controllers/         # Logika bisnis sistem (Auth, Petani, Kartu, DAMRI, Bantuan, Laporan)
│   ├── middlewares/         # Autentikasi, otorisasi RBAC, sesi cookie
│   ├── routes/              # Routing endpoint aplikasi & API
│   └── utils/               # View engine, enkripsi password, audit logger
├── views/                   # Template antarmuka pengguna (Tailwind & EJS)
│   ├── partials/            # Header, Navbar, Sidebar, Footer modular
│   ├── auth/                # Halaman login modern
│   ├── dashboard/           # Dashboard manajemen & portal petani
│   ├── farmers/             # CRUD, verifikasi, dan detail petani
│   ├── cards/               # Cetak kartu tunggal & cetak massal
│   ├── transport/           # Scanner QR, pencatatan trip, riwayat DAMRI
│   ├── aids/                # Program bantuan Otsus & penyaluran
│   ├── groups/              # Kelompok tani binaan
│   └── reports/             # Laporan resmi cetak & ekspor CSV
├── .env.example             # Contoh konfigurasi lingkungan
├── .gitignore
├── package.json
├── server.js                # Titik masuk utama aplikasi (Entry Point)
└── README.md                # Dokumentasi utama proyek
```

---

## 🚀 5. Cara Instalasi & Menjalankan Aplikasi

### Prasyarat:
1. **Node.js** (versi 18 ke atas / v22 LTS disarankan).
2. **MySQL Server** (melalui XAMPP, MariaDB, atau standalone MySQL di port 3306).

### Langkah Instalasi:

1. **Clone Repository:**
   ```bash
   git clone https://github.com/pustahalab/dinas-pertanian.git
   cd dinas-pertanian
   ```

2. **Pasang Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment (.env):**
   Salin berkas `.env.example` menjadi `.env`, sesuaikan kredensial MySQL jika diperlukan:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASS=
   DB_NAME=dinas_pertanian_db
   SESSION_SECRET=kartani-biak-numfor-2026-secret-key-oap
   ```

4. **Inisialisasi Database & Seeding 500 Data Petani:**
   Jalankan perintah seeder untuk otomatis membuat database, tabel, akun demo, dan memasukkan 500 data petani resmi Biak Numfor:
   ```bash
   npm run seed
   ```

5. **Jalankan Aplikasi:**
   ```bash
   npm start
   ```
   Aplikasi akan aktif pada: **`http://localhost:3000`**

---

## 🔑 6. Akun Pengguna untuk Pengujian (Demo Login)

Pada halaman masuk (`/login`) disediakan tombol **1-Click Quick Demo Login** sehingga penguji tidak perlu mengetik kata sandi secara manual:

| Role | Username | Password | Deskripsi Pengujian |
|---|---|---|---|
| **Admin Dinas** | `admin` | `admin123` | Akses penuh seluruh master data, petani, kelompok tani, laporan eksekutif. |
| **Petugas Lapangan** | `petugas` | `petugas123` | Uji coba verifikasi lapangan data petani & pencatatan serah terima bantuan. |
| **Kepala Dinas** | `pimpinan` | `pimpinan123` | Uji coba penetapan status bantuan & aktivasi Kartu Tani OAP. |
| **Petugas DAMRI** | `damri` | `damri123` | Uji coba scan QR Code, validasi keaktifan kartu, dan catat muatan hasil panen. |
| **Petani OAP** | `petani` | `petani123` | Portal digital petani mandiri, menampilkan kartu tani dan riwayat bantuan. |

---

## 📄 7. Dokumentasi Tambahan

- [Dokumen Arsitektur Sistem & Alur Kerja (Mermaid Diagram)](docs/ARSITEKTUR_SISTEM.md)
- [Perancangan Basis Data (ERD & Kamus Data)](docs/PERANCANGAN_DATABASE.md)
- [Panduan Pengguna & Skenario Pengujian](docs/PANDUAN_PENGGUNA.md)
- [Dokumentasi REST API Integrasi DAMRI](docs/API_DOCUMENTATION.md)

---

## 🏛️ Hak Cipta & Pengembang

Dikembangkan sebagai bagian dari Tugas Akhir Program Studi Sistem Informasi, Fakultas Biosains, Teknologi, dan Inovasi, **Universitas Katolik Indonesia Atma Jaya Jakarta** bekerja sama dengan **Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor**, Provinsi Papua.
