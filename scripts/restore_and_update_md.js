const { execSync } = require('child_process');
const fs = require('fs');

// 1. Ambil versi lengkap original dari c57899f
let orig = execSync('git show c57899f:docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md').toString('utf8');

// 2. Modifikasi Identitas Pengusul di Cover & Header
const oldIdentitas = `### IDENTITAS PENGUSUL
* **Nama Pengusul** : Ir. Denny Jean Cross Sihombing, S.T., M.T.
* **NIDN / NIP** : 0315087501
* **Jabatan** : Dosen Program Studi Sistem Informasi
* **Institusi** : Fakultas Biosains, Teknologi, dan Inovasi (FBTI), Universitas Katolik Indonesia Atma Jaya Jakarta
* **Alamat Institusi** : Jl. Jenderal Sudirman No. 51, Semanggi, Jakarta Selatan 12930
* **Email / Kontak** : denny.sihombing@atmajaya.ac.id / +62 812-9876-XXXX
* **Bidang Keahlian** : Rekayasa Sistem Informasi, Tata Kelola TI Pemerintah (*E-Government*), Arsitektur Basis Data & Perangkat Lunak Enterprise`;

const newIdentitas = `### IDENTITAS PENGUSUL & PENGEMBANG SISTEM
* **Nama Pengusul** : **Ir. Denny Jean Cross Sihombing, S.T., M.T.**
* **Peran / Kapasitas** : Pengembang Sistem Informasi & Konsultan Rekayasa Perangkat Lunak *(bertindak mandiri atas nama profesional pengembang sistem)*
* **Latar Belakang Akademisi** : Dosen Program Studi Sistem Informasi, Universitas Katolik Indonesia Atma Jaya Jakarta
* **Laman Web Resmi** : **dennyjcs.com**
* **Pos-el Resmi** : **denny.jean@atmajaya.ac.id**
* **Bidang Keahlian** : Rekayasa Sistem Informasi Enterprise, Arsitektur Basis Data Relasional, Keamanan Perangkat Lunak & QR Code, Tata Kelola Sistem Pemerintahan (*E-Government*)`;

orig = orig.replace(oldIdentitas, newIdentitas);

// Ganti nomor surat & perihal jika perlu
orig = orig.replace(
  /\*\*Nomor Usulan\*\* : .*/,
  '**Nomor Usulan** : 012/EXT-PROP/DJCS/XI/2026'
);

// Ganti ringkasan eksekutif durasi & total
orig = orig.replace(
  /Total usulan anggaran biaya pengembangan.*?(?=\n\n---)/s,
  'Total usulan anggaran biaya pengembangan, implementasi infrastruktur cloud berkinerja tinggi, pengujian lapangan di Biak Numfor, sosialisasi, pelatihan (*TOT*), hingga serah terima sistem digital murni berbasis aplikasi adalah sebesar **Rp 247.450.000,- (Dua Ratus Empat Puluh Tujuh Juta Empat Ratus Lima Puluh Ribu Rupiah)** untuk durasi pekerjaan intensif selama **4 (empat) bulan kalender**. Sesuai arahan efisiensi dan modernisasi tata kelola digital (*paperless & digital-native*), sistem beroperasi secara penuh melalui aplikasi web mobile dan pemindai QR Code di smartphone tanpa memerlukan pengadaan kartu fisik PVC maupun mesin cetak termal.'
);

// Ganti Bab 1.3 & 1.4
orig = orig.replace(
  '2. Bagaimana merancang kartu identitas petani digital dan fisik yang dilengkapi nomor registrasi unik serta QR Code terenkripsi yang mampu divalidasi secara seketika (*realtime*) di lapangan?',
  '2. Bagaimana merancang kartu identitas petani digital murni berbasis aplikasi yang dilengkapi nomor registrasi unik serta QR Code dinamis terenkripsi yang mampu divalidasi seketika (*realtime*) di lapangan tanpa bergantung pada kartu fisik PVC?'
);

orig = orig.replace(
  '3. Bagaimana mengintegrasikan mekanisme verifikasi kartu tani dengan alur operasional pengangkutan komoditas DAMRI sehingga tercatat data manifes rute, komoditas, dan tonase hasil panen?',
  '3. Bagaimana mengintegrasikan mekanisme verifikasi kartu tani digital dengan alur operasional pengangkutan komoditas DAMRI menggunakan kamera smartphone petugas DAMRI sehingga tercatat data manifes rute, komoditas, dan tonase hasil panen secara paperless?'
);

orig = orig.replace(
  /\* \*\*Maksud\*\*: Terwujudnya kemitraan strategis tridharma perguruan tinggi antara Program Studi Sistem Informasi Unika Atma Jaya Jakarta dengan Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor dalam mendigitalisasi layanan pertanian dan transportasi logistik pascapanen\./,
  '* **Maksud**: Terwujudnya kerjasama profesional dan keahlian rekayasa teknologi informasi antara pengembang sistem (Ir. Denny Jean Cross Sihombing, S.T., M.T. yang juga merupakan Dosen Sistem Informasi Unika Atma Jaya Jakarta) dengan Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor dalam mendigitalisasi layanan penerima manfaat pertanian Otsus dan transportasi logistik pascapanen.'
);

orig = orig.replace(
  '2. Menyediakan instrumen penerbitan Kartu Tani OAP digital serta cetak massal (*batch print*).',
  '2. Menyediakan instrumen identitas digital Kartu Tani OAP murni berbasis aplikasi web mobile dengan QR Code unik terenkripsi.'
);

orig = orig.replace(
  '3. **Modul Penerbitan Kartu Tani Digital & QR Code Engine**: Pembuatan QR Code dinamis berbasis token kriptografis beresolusi tinggi beserta fitur cetak lembar fisik massal.',
  '3. **Modul Penerbitan Kartu Tani Digital & QR Code Engine**: Pembuatan QR Code dinamis berbasis token kriptografis beresolusi tinggi pada aplikasi mobile/web portal petani OAP secara *paperless*.'
);

// Ganti Bab III Tim Ahli
const oldBab3 = /## BAB III: SUSUNAN TIM AHLI & STRUKTUR PELAKSANA[\s\S]*?(?=\n\n---)/;
const newBab3 = `## BAB III: SUSUNAN TIM AHLI & STRUKTUR PELAKSANA

Kegiatan rancang bangun dan implementasi sistem ini dipimpin langsung oleh **Ir. Denny Jean Cross Sihombing, S.T., M.T.** bertindak sebagai Pengembang Utama & Arsitek Perangkat Lunak (yang juga merupakan Dosen Tetap Program Studi Sistem Informasi Universitas Katolik Indonesia Atma Jaya Jakarta), didukung oleh tim rekayasa sistem profesional berpengalaman:

| No | Posisi / Jabatan | Nama Personel | Kualifikasi & Peran Pokok |
|:--:|---|---|---|
| 1 | **Ketua Tim / Lead Software Architect** | **Ir. Denny Jean Cross Sihombing, S.T., M.T.** | Magister Teknik Informatika/Sistem Informasi, Dosen Tetap Sistem Informasi Unika Atma Jaya Jakarta, Praktisi Pengembang Sistem. Bertanggung jawab atas kepemimpinan proyek, koordinasi tingkat tinggi dengan Dinas Pertanian Biak Numfor, perancangan arsitektur enterprise, kendali mutu perangkat lunak, dan supervisi metodologi. |
| 2 | **System Analyst & Business Process Specialist** | **Dian Violin Kapisa** | Sarjana Sistem Informasi, peneliti domain spesifik pertanian Biak Numfor. Bertanggung jawab atas elisitasi kebutuhan fungsional, analisis alur proses bisnis subsidi Otsus dan angkutan DAMRI, pemodelan proses use case/activity, validasi data 500+ petani OAP, serta modul pengujian fungsional. |
| 3 | **Senior Software Engineer & Database Architect** | **Tenaga Ahli Rekayasa Perangkat Lunak (Senior Fullstack)** | Pengalaman >7 tahun rekayasa perangkat lunak Node.js, Express, dan basis data relasional MySQL. Bertanggung jawab atas perancangan skema basis data teroptimasi, implementasi logika backend, integrasi HTML5 QR Code Scanner, antarmuka web responsif mobile, dan keamanan sistem. |`;

orig = orig.replace(oldBab3, newBab3);

// Ganti Bab IV Jadwal
const oldBab4 = /## BAB IV: JADWAL & TAHAPAN PELAKSANAAN PROYEK[\s\S]*?(?=\n\n---)/;
const newBab4 = `## BAB IV: JADWAL & TAHAPAN PELAKSANAAN PROYEK (4 BULAN KALENDER)

Pekerjaan pengembangan dan implementasi sistem direncanakan berlangsung secara terstruktur, intensif, dan berorientasi hasil selama **4 (empat) bulan kalender** dengan jadwal pelaksanaan sebagai berikut:

| No | Tahapan Kegiatan Pelaksanaan | Bulan 1 | Bulan 2 | Bulan 3 | Bulan 4 |
|:--:|---|:---:|:---:|:---:|:---:|
| 1 | Kick-off Meeting, Koordinasi Teknis Dinas, Elisitasi Kebutuhan, & Validasi Data 500 Petani | ████ | | | |
| 2 | Perancangan Arsitektur Sistem, Basis Data Relasional, & Wireframe UI Responsif Mobile | ████ | | | |
| 3 | Pembangunan Core System (Modul Petani OAP, Verifikasi Berjenjang, Kartu Digital QR) | | ████ | | |
| 4 | Pembangunan Modul Operasional DAMRI (HTML5 Camera Scanner & Form Manifest Muatan) | | ████ | ████ | |
| 5 | Pembangunan Modul Bantuan Otsus, Dashboard Eksekutif, & Laporan Resmi Kop Dinas | | | ████ | |
| 6 | Pengujian Sistem Internal (Unit Testing, Security Hardening, Cryptographic Session) | | | ████ | |
| 7 | Setup Server VPS Cloud, Domain Resmi Daerah, SSL Certificate Wildcard, & DB HA | | | ████ | ████ |
| 8 | UAT & Uji Coba Lapangan (Field Trial) Bersama Petugas Lapangan DAMRI di Biak Numfor | | | | ████ |
| 9 | Pelatihan Operator (*Training of Trainers / TOT*), Penyusunan Panduan, & Video Tutorial | | | | ████ |
| 10 | Penyusunan Laporan Akhir, Berita Acara Serah Terima (BAST), & Pendampingan Go-Live | | | | ████ |`;

orig = orig.replace(oldBab4, newBab4);

// Ganti Bab V RAB
const oldBab5 = /## BAB V: RENCANA ANGGARAN BIAYA \(RAB\) LENGKAP[\s\S]*?(?=## BAB VI: LUARAN KEGIATAN)/;
const newBab5 = `## BAB V: RENCANA ANGGARAN BIAYA (RAB) LENGKAP (4 BULAN PEKERJAAN)

Rencana Anggaran Biaya (RAB) disusun berdasarkan prinsip efisiensi, akuntabilitas, standar biaya masukan yang wajar, serta penyesuaian durasi pelaksanaan proyek selama **4 (empat) bulan kalender**. Sesuai arahan modernisasi digital, sistem dirancang murni berbasis aplikasi (*paperless & digital-native*) menggunakan identitas digital dan pemindai QR Code kamera smartphone, sehingga tidak memerlukan biaya pengadaan kartu fisik PVC maupun perangkat percetakan termal.

### 5.1 Rincian Biaya per Komponen Kegiatan

#### Komponen 1: Honorarium Tenaga Ahli Inti (4 Bulan Pekerjaan)
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

orig = orig.replace(oldBab5, newBab5);

// Ganti Bab VII Tanda Tangan
const oldBab7 = /## BAB VII: PENUTUP & LEMBAR PENGESAHAN[\s\S]*$/;
const newBab7 = `## BAB VII: PENUTUP & LEMBAR PENGESAHAN

Proposal ini disusun sebagai wujud komitmen profesional dalam mendukung percepatan transformasi digital sektor pertanian dan tata kelola logistik pascapanen bagi petani Orang Asli Papua (OAP) di Kabupaten Biak Numfor. Sistem ini diharapkan tidak hanya memberikan kepastian data penerima bantuan program Otsus, namun juga mengoptimalkan keterisian armada bus perintis DAMRI sebagai urat nadi konektivitas pangan kepulauan.

Besar harapan kami usulan ini dapat diterima dan disetujui untuk ditindaklanjuti dalam bentuk kerja sama formal pengadaan jasa keahlian pengembangan sistem informasi. Atas perhatian, perkenan, dan kerja sama yang baik dari Pemerintah Kabupaten Biak Numfor, kami sampaikan terima kasih yang sebesar-besarnya.

---

Jakarta, 16 November 2026

**Diajukan Oleh:**  
**Pengembang Sistem Informasi / Ketua Tim Ahli,**  

<br><br><br>

**<u>Ir. Denny Jean Cross Sihombing, S.T., M.T.</u>**  
Pengembang Sistem Informasi & Konsultan Rekayasa Perangkat Lunak  
*(Dosen Program Studi Sistem Informasi, Universitas Katolik Indonesia Atma Jaya Jakarta)*  
Laman Web: **dennyjcs.com**  
Pos-el: **denny.jean@atmajaya.ac.id**  
`;

orig = orig.replace(oldBab7, newBab7);

// Update daftar isi
orig = orig.replace('5. [BAB IV: Jadwal & Tahapan Pelaksanaan Proyek (6 Bulan)](#bab-iv-jadwal--tahapan-pelaksanaan-proyek)', '5. [BAB IV: Jadwal & Tahapan Pelaksanaan Proyek (4 Bulan)](#bab-iv-jadwal--tahapan-pelaksanaan-proyek-4-bulan-kalender)');

fs.writeFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md', orig, 'utf8');
console.log('Restored and updated full PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md, size:', orig.length);
