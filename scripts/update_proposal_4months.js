const fs = require('fs');

let md = fs.readFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md', 'utf8');

// 1. Cover / Pengusul update
md = md.replace(
  /\*\*PENGUSUL / KETUA TIM PELAKSANA:\*\*[\s\S]*?(?=\n\n\*\*INSTITUSI / KEMITRAAN:\*\*)/,
  '**PENGUSUL & PENGEMBANG SISTEM:**  \n**Ir. Denny Jean Cross Sihombing, S.T., M.T.**  \n*(Pengembang Sistem Informasi & Dosen Program Studi Sistem Informasi, Universitas Katolik Indonesia Atma Jaya Jakarta)*'
);

md = md.replace(
  /\*\*INSTITUSI \/ KEMITRAAN:\*\*[\s\S]*?(?=\n\n\*\*DITUJUKAN KEPADA:\*\*)/,
  '**KAPASITAS PENGUSUL:**  \nKonsultan Independen / Pengembang Sistem Perangkat Lunak  \n*(Bertindak atas nama profesional pengembang, berlatar belakang akademisi Dosen Sistem Informasi)*'
);

// 2. Ringkasan Eksekutif update
md = md.replace(
  /Total usulan anggaran biaya pengembangan.*?(?=\n\n---)/s,
  'Total usulan anggaran biaya pengembangan, implementasi infrastruktur cloud berkinerja tinggi, pengujian lapangan di Biak Numfor, sosialisasi, pelatihan (*TOT*), hingga serah terima sistem digital murni berbasis aplikasi adalah sebesar **Rp 247.450.000,- (Dua Ratus Empat Puluh Tujuh Juta Empat Ratus Lima Puluh Ribu Rupiah)** untuk durasi pekerjaan intensif selama **4 (empat) bulan kalender**. Sesuai arahan efisiensi dan modernisasi tata kelola digital (*paperless & digital-native*), sistem beroperasi secara penuh melalui aplikasi web mobile dan pemindai QR Code di smartphone tanpa memerlukan pengadaan kartu fisik PVC maupun mesin cetak termal.'
);

// 3. Bab 1.4 Maksud & Tujuan update
md = md.replace(
  /\* \*\*Maksud\*\*: Terwujudnya kemitraan strategis tridharma perguruan tinggi antara Program Studi Sistem Informasi Unika Atma Jaya Jakarta dengan Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor dalam mendigitalisasi layanan pertanian dan transportasi logistik pascapanen\./,
  '* **Maksud**: Terwujudnya kerjasama teknis dan keahlian rekayasa teknologi informasi antara pengembang sistem independen (yang juga bertugas sebagai Dosen Sistem Informasi Unika Atma Jaya) dengan Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor dalam mendigitalisasi layanan penerima manfaat pertanian Otsus dan transportasi logistik pascapanen.'
);

// 4. Bab III Intro update
md = md.replace(
  /Kegiatan rancang bangun dan implementasi ini dipimpin langsung oleh Tenaga Ahli Akademisi dari Unika Atma Jaya Jakarta didukung oleh tim rekayasa perangkat lunak inti yang berpengalaman:/,
  'Kegiatan rancang bangun dan implementasi sistem ini dipimpin langsung oleh Ir. Denny Jean Cross Sihombing, S.T., M.T. sebagai Pengembang Sistem dan Arsitek Perangkat Lunak (yang juga merupakan Dosen Tetap Sistem Informasi Unika Atma Jaya), didukung oleh tim rekayasa sistem profesional berpengalaman:'
);

// 5. Bab IV Jadwal 4 Bulan update
const oldBab4 = `## BAB IV: JADWAL & TAHAPAN PELAKSANAAN PROYEK

Proyek direncanakan berlangsung selama **6 (enam) bulan kalender** dengan jadwal kerja terperinci sebagai berikut:

| No | Tahapan Kegiatan | Bulan 1 | Bulan 2 | Bulan 3 | Bulan 4 | Bulan 5 | Bulan 6 |
|:--:|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | Kick-off Meeting, Koordinasi Dinas, & Pengumpulan Data Awal | ████ | | | | | |
| 2 | Analisis Kebutuhan Sistem, Pemodelan Proses Bisnis, & Validasi Data 500 Petani | ████ | ████ | | | | |
| 3 | Desain Arsitektur Sistem, Skema Basis Data Relasional, & Wireframing UI/UX | | ████ | | | | |
| 4 | Pembangunan Core System (Modul Petani, Verifikasi Berjenjang, & Penerbitan Kartu) | | ████ | ████ | | | |
| 5 | Pembangunan Modul Integrasi DAMRI, QR Code Engine, & Scanner Lapangan | | | ████ | ████ | | |
| 6 | Pembangunan Modul Program Bantuan Otsus, Dashboard Eksekutif, & Pelaporan Resmi | | | | ████ | | |
| 7 | Pengujian Internal (Unit Testing, Security Hardening, & Integration Testing) | | | | ████ | ████ | |
| 8 | Deployment Server Cloud / On-Premise & Konfigurasi Lingkungan Produksi | | | | | ████ | |
| 9 | Uji Coba Lapangan (Field Trial) Bersama Tim DAMRI & Verifikator di Biak | | | | | ████ | ████ |
| 10 | Pelatihan Operator (*Training of Trainers / TOT*), Penyusunan Dokumentasi, & Serah Terima | | | | | | ████ |`;

const newBab4 = `## BAB IV: JADWAL & TAHAPAN PELAKSANAAN PROYEK (4 BULAN)

Pekerjaan pengembangan dan implementasi sistem direncanakan berlangsung secara intensif dan terstruktur selama **4 (empat) bulan kalender** dengan jadwal pelaksanaan sebagai berikut:

| No | Tahapan Kegiatan | Bulan 1 | Bulan 2 | Bulan 3 | Bulan 4 |
|:--:|---|:---:|:---:|:---:|:---:|
| 1 | Kick-off Meeting, Koordinasi Dinas, Elisitasi Kebutuhan, & Validasi Data 500 Petani | ████ | | | |
| 2 | Perancangan Arsitektur Sistem, Basis Data Relasional, & Wireframe UI Responsif | ████ | | | |
| 3 | Pembangunan Core System (Modul Petani OAP, Verifikasi Berjenjang, Kartu Digital QR) | | ████ | | |
| 4 | Pembangunan Modul Operasional DAMRI (HTML5 Camera Scanner & Form Manifest Muatan) | | ████ | ████ | |
| 5 | Pembangunan Modul Bantuan Otsus, Dashboard Eksekutif, & Laporan Resmi Kop Dinas | | | ████ | |
| 6 | Pengujian Sistem Internal (Unit Testing, Security Hardening, Session Cryptography) | | | ████ | |
| 7 | Setup Server VPS Cloud, Domain Resmi Daerah, SSL Certificate, & Database HA | | | ████ | ████ |
| 8 | UAT & Uji Coba Lapangan (Field Trial) Bersama Petugas Lapangan DAMRI di Biak | | | | ████ |
| 9 | Pelatihan Operator (*Training of Trainers / TOT*), Buku Panduan, & Video Tutorial | | | | ████ |
| 10 | Laporan Akhir, Berita Acara Serah Terima (BAST), & Pendampingan Go-Live | | | | ████ |`;

md = md.replace(oldBab4, newBab4);

// 6. Bab V RAB 4 Bulan update
const bab5Regex = /## BAB V: RENCANA ANGGARAN BIAYA \(RAB\) LENGKAP[\s\S]*?(?=## BAB VI: LUARAN KEGIATAN)/;
const bab5Content = `## BAB V: RENCANA ANGGARAN BIAYA (RAB) LENGKAP (4 BULAN PEKERJAAN)

Rencana Anggaran Biaya (RAB) disusun berdasarkan prinsip efisiensi, akuntabilitas, standar biaya masukan yang wajar, serta penyesuaian durasi pelaksanaan proyek selama **4 (empat) bulan kalender**. Sesuai arahan modernisasi digital, sistem dirancang murni berbasis aplikasi (*paperless & digital-native*) menggunakan identitas digital dan pemindai QR Code kamera smartphone, sehingga tidak memerlukan biaya pengadaan kartu fisik PVC maupun perangkat percetakan termal.

### 5.1 Rincian Biaya per Komponen Kegiatan

#### Komponen 1: Honorarium Tenaga Ahli Inti (4 Bulan)
| No | Uraian Tenaga Ahli | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 1.1 | Ketua Tim / Lead Software Architect (Ir. Denny Jean Cross Sihombing, S.T., M.T.) | 4 | Orang/Bulan (OB) | 12.500.000 | 50.000.000 |
| 1.2 | System Analyst & Business Process Specialist (Dian Violin Kapisa) | 4 | Orang/Bulan (OB) | 7.500.000 | 30.000.000 |
| 1.3 | Senior Software Engineer & Database Architect | 4 | Orang/Bulan (OB) | 9.000.000 | 36.000.000 |
| **Subtotal Komponen 1** | | | | | **Rp 116.000.000** |

#### Komponen 2: Infrastruktur Cloud Server, Domain, Database, & Lisensi Pendukung (Tahun Pertama)
| No | Uraian Infrastruktur & Lisensi | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 2.1 | Cloud Virtual Private Server (VPS Enterprise, 8 vCPU, 16 GB RAM, NVMe SSD) | 12 | Bulan | 1.850.000 | 22.200.000 |
| 2.2 | Managed Relational Database Service (MySQL High Availability Backup) | 12 | Bulan | 1.100.000 | 13.200.000 |
| 2.3 | Domain Resmi Pemerintah Daerah (.go.id / biakkab.go.id) & SSL Certificate Wildcard 2 Tahun | 1 | Paket | 2.850.000 | 2.850.000 |
| 2.4 | Cloud Storage & Object Backup Service (Penyimpanan Foto Petani & Dokumen Verifikasi) | 12 | Bulan | 650.000 | 7.800.000 |
| 2.5 | Layanan Gateway Pengiriman Notifikasi & SMS/WA Verifikasi Petani | 1 | Paket | 4.500.000 | 4.500.000 |
| **Subtotal Komponen 2** | | | | | **Rp 50.550.000** |

#### Komponen 3: Operasional Lapangan, Koordinasi, & Perjalanan Dinas ke Biak Numfor
| No | Uraian Perjalanan Dinas & Operasional | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 3.1 | Tiket Pesawat PP Jakarta - Biak (Tim Ahli 2 Orang x 2 Kunjungan: Kick-Off & UAT/Training) | 4 | Tiket PP | 6.500.000 | 26.000.000 |
| 3.2 | Akomodasi & Penginapan di Biak Numfor (2 Orang x 3 Hari x 2 Kunjungan) | 12 | Hari/Orang | 1.000.000 | 12.000.000 |
| 3.3 | Transportasi Lokal Lapangan (Sewa Kendaraan Roda 4 Survei 10 Distrik Biak Numfor) | 14 | Hari | 750.000 | 10.500.000 |
| 3.4 | Uang Harian Perjalanan Dinas Tim Ahli sesuai SBM Daerah | 28 | Hari/Orang | 450.000 | 12.600.000 |
| **Subtotal Komponen 3** | | | | | **Rp 61.100.000** |

#### Komponen 4: Pelatihan (*Training of Trainers*), Sosialisasi, Dokumentasi, & Pelaporan
| No | Uraian Kegiatan Pelatihan & Pelaporan | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 4.1 | Konsumsi & Fasilitasi Workshop Pelatihan Operator Dinas & Petugas DAMRI (35 Peserta x 2 Hari) | 70 | Orang/Hari | 125.000 | 8.750.000 |
| 4.2 | Penggandaan Modul Buku Panduan Administrator, Petugas PPL, dan Petugas DAMRI (Cetak Full Color Glossy) | 50 | Buku | 95.000 | 4.750.000 |
| 4.3 | Pembuatan Video Panduan Penggunaan (*Video Tutorial Animasi & Live Demo*) | 1 | Paket | 4.500.000 | 4.500.000 |
| 4.4 | Penyusunan Berkas Laporan Akhir Proyek, Arsitektur Sistem, & Berita Acara Serah Terima (Hardcover) | 5 | Eksemplar | 360.000 | 1.800.000 |
| **Subtotal Komponen 4** | | | | | **Rp 19.800.000** |

---

### 5.2 Rekapitulasi Rencana Anggaran Biaya (RAB) - Durasi 4 Bulan

| No | Komponen Anggaran | Jumlah Biaya (Rp) | Persentase (%) |
|:--:|---|---:|:---:|
| 1 | **Komponen 1: Honorarium Tenaga Ahli Inti (4 Bulan)** | 116.000.000 | 46,88% |
| 2 | **Komponen 2: Infrastruktur Cloud Server, Domain, Database, & Lisensi** | 50.550.000 | 20,43% |
| 3 | **Komponen 3: Operasional Lapangan, Koordinasi, & Perjalanan Dinas ke Biak Numfor** | 61.100.000 | 24,69% |
| 4 | **Komponen 4: Pelatihan (TOT), Sosialisasi, Modul Panduan, & Dokumentasi Akhir** | 19.800.000 | 8,00% |
| | **TOTAL KESELURUHAN ANGGARAN BIAYA (RAB)** | **Rp 247.450.000** | **100,00%** |

*(Terbilang: **Dua Ratus Empat Puluh Tujuh Juta Empat Ratus Lima Puluh Ribu Rupiah**)*

> **Catatan Finansial**:
> 1. Anggaran telah memperhitungkan seluruh biaya alih pengetahuan (*transfer of knowledge*), penyediaan hak pakai kode sumber tanpa royalti berkala (*royalty-free source code*), serta pendampingan masa garansi (*maintenance support*) selama **6 (enam) bulan pasca serah terima**.
> 2. Besaran anggaran dapat disesuaikan kembali berdasarkan mekanisme kontrak pengadaan jasa keahlian / konsultansi pengembangan sistem informasi di lingkungan Pemerintah Kabupaten Biak Numfor sesuai dengan ketentuan pengadaan barang dan jasa pemerintah (LKPP).

---

`;

md = md.replace(bab5Regex, bab5Content);

fs.writeFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md', md, 'utf8');
console.log('Successfully updated docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md for 4 months');
