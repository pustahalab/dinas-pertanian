# PROPOSAL PENGEMBANGAN DAN IMPLEMENTASI
## SISTEM INFORMASI MANAJEMEN KARTU TANI OAP (ORANG ASLI PAPUA) TERINTEGRASI LAYANAN TRANSPORTASI DAMRI
### Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor, Provinsi Papua

---

**Nomor Usulan** : 012/EXT-PROP/DJCS/XI/2026
**Lampiran** : 1 (Satu) Berkas Lengkap Rencana Anggaran Biaya (RAB)  
**Perihal** : Permohonan dan Pengajuan Kerja Sama Rancang Bangun & Implementasi Sistem Informasi Manajemen Kartu Tani OAP Terintegrasi Layanan Transportasi DAMRI  

**Kepada Yth.**  
**Plt. Kepala Dinas Pertanian dan Ketahanan Pangan**  
**Kabupaten Biak Numfor**  
**Bapak drh. BAMBANG HAYANTO**  
di -  
&nbsp;&nbsp;&nbsp;&nbsp;Biak Numfor, Provinsi Papua  

---

### IDENTITAS PENGUSUL & PENGEMBANG SISTEM
* **Nama Pengusul** : **Ir. Denny Jean Cross Sihombing, S.T., M.T.**
* **Peran / Kapasitas** : Pengembang Sistem Informasi & Konsultan Rekayasa Perangkat Lunak *(bertindak mandiri atas nama profesional pengembang sistem)*
* **Latar Belakang Akademisi** : Dosen Program Studi Sistem Informasi, Universitas Katolik Indonesia Atma Jaya Jakarta
* **Laman Web Resmi** : **dennyjcs.com**
* **Pos-el Resmi** : **denny.jean@atmajaya.ac.id**
* **Bidang Keahlian** : Rekayasa Sistem Informasi Enterprise, Arsitektur Basis Data Relasional, Keamanan Perangkat Lunak & QR Code, Tata Kelola Sistem Pemerintahan (*E-Government*)

---

## DAFTAR ISI

1. [Ringkasan Eksekutif](#ringkasan-eksekutif)
2. [BAB I: Pendahuluan](#bab-i-pendahuluan)
   - 1.1 Latar Belakang Masalah
   - 1.2 Dasar Hukum dan Landasan Kebijakan
   - 1.3 Rumusan Masalah
   - 1.4 Maksud, Tujuan, dan Sasaran
   - 1.5 Ruang Lingkup Sistem
3. [BAB II: Rancang Bangun & Arsitektur Solusi](#bab-ii-rancang-bangun--arsitektur-solusi)
   - 2.1 Metodologi Pengembangan (*Prototyping & Agile Iterative*)
   - 2.2 Arsitektur Sistem & Keamanan Data
   - 2.3 Rincian Modul & Fungsionalitas Aplikasi
   - 2.4 Mekanisme Integrasi Transportasi DAMRI & Validasi QR Code
4. [BAB III: Susunan Tim Ahli & Struktur Pelaksana](#bab-iii-susunan-tim-ahli--struktur-pelaksana)
5. [BAB IV: Jadwal & Tahapan Pelaksanaan Proyek (4 Bulan)](#bab-iv-jadwal--tahapan-pelaksanaan-proyek-4-bulan-kalender)
6. [BAB V: Rencana Anggaran Biaya (RAB) Lengkap](#bab-v-rencana-anggaran-biaya-rab-lengkap)
   - 5.1 Rincian Biaya per Komponen Kegiatan
   - 5.2 Rekapitulasi Anggaran Biaya
7. [BAB VI: Luaran Kegiatan (Deliverables) & Keberlanjutan](#bab-vi-luaran-kegiatan-deliverables--keberlanjutan)
8. [BAB VII: Penutup & Lembar Pengesahan](#bab-vii-penutup--lembar-pengesahan)

---

## RINGKASAN EKSEKUTIF

Pemberdayaan ekonomi masyarakat Orang Asli Papua (OAP) di Kabupaten Biak Numfor menempatkan sektor pertanian pangan sebagai pilar ketahanan ekonomi keluarga. Alokasi Dana Otonomi Khusus (Otsus) Papua di bidang pertanian diwujudkan melalui pemberian bantuan benih unggul, pupuk, alsintan, serta fasilitas subsidi transportasi pascapanen. Namun, pelaksanaan di lapangan menghadapi dua kendala pokok: (1) Tata kelola administrasi pendataan dan verifikasi penerima bantuan yang masih manual berbasis berkas Excel/Word sehingga rawan duplikasi dan keterlambatan verifikasi, serta (2) Hambatan logistik transportasi hasil panen dari kampung sentra produksi di 10 distrik menuju pasar distribusi (*Pasar Tani Fandoi, Pasar Darfuar, Pasar Bosnik*).

Menjawab Surat Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor Nomor *400.10.5/205/IX/DISTAN/2026*, kami mengajukan usulan komprehensif **Pengembangan dan Implementasi Sistem Informasi Manajemen Kartu Tani OAP Terintegrasi Layanan Transportasi DAMRI (SIM-KARTANI BIAK NUMFOR)**. 

Sistem ini mentransformasikan pendataan 500+ petani OAP menjadi basis data relasional terverifikasi, menerbitkan **Kartu Tani Digital ber-QR Code terenkripsi**, memfasilitasi verifikasi kelayakan berjenjang (*Petugas PPL $\rightarrow$ Penetapan Kepala Dinas*), serta menyediakan **aplikasi pemindai QR Code realtime** untuk armada bus DAMRI Perintis guna memastikan petani OAP memperoleh hak subsidi angkutan panen secara tepat sasaran, akuntabel, dan transparan.

Total usulan anggaran biaya pengembangan, implementasi infrastruktur cloud berkinerja tinggi, pengujian lapangan di Biak Numfor, sosialisasi, pelatihan (*TOT*), hingga serah terima sistem digital murni berbasis aplikasi adalah sebesar **Rp 247.450.000,- (Dua Ratus Empat Puluh Tujuh Juta Empat Ratus Lima Puluh Ribu Rupiah)** untuk durasi pekerjaan intensif selama **4 (empat) bulan kalender**. Sesuai arahan efisiensi dan modernisasi tata kelola digital (*paperless & digital-native*), sistem beroperasi secara penuh melalui aplikasi web mobile dan pemindai QR Code di smartphone tanpa memerlukan pengadaan kartu fisik PVC maupun mesin cetak termal.

---

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang Masalah
Kabupaten Biak Numfor memiliki potensi pertanian pangan lokal yang sangat kaya, khususnya komoditas Keladi Biak (*Colocasia esculenta*), Ubi Jalar (*Petatas*), Singkong (*Kasbi*), Sayuran Lilin, Jagung, dan tanaman hortikultura lainnya. Petani Orang Asli Papua (OAP) merupakan produsen utama komoditas pangan ini yang tersebar di 10 distrik, antara lain Distrik Biak Barat, Biak Timur, Biak Utara, Warsa, Andey, Swandiwe, Bondifuar, Yendidori, Oridek, dan Samofa.

Pemerintah Kabupaten Biak Numfor melalui Dinas Pertanian dan Ketahanan Pangan telah meluncurkan berbagai program intervensi melalui pembiayaan Dana Otonomi Khusus (Otsus) Papua. Salah satu program inovatif yang sedang dirintis adalah penyediaan **Kartu Tani OAP** yang terhubung dengan akses angkutan armada DAMRI Perintis. Fasilitas transportasi ini sangat krusial karena jarak tempuh dari kampung-kampung sentra produksi menuju pusat pemasaran di Kota Biak (Pasar Tani Fandoi dan Pasar Darfuar) berkisar antara 25 km hingga 80 km. Ketiadaan akses transportasi yang terorganisasi menyebabkan komoditas hasil panen seringkali membusuk di lahan atau petani terpaksa membayar biaya sewa kendaraan carteran yang sangat tinggi sehingga meniadakan marjin keuntungan petani.

Akan tetapi, dalam pelaksanaannya terdapat tantangan mendasar:
1. **Administrasi Pendataan Tersebar & Rawan Duplikasi**: Berdasarkan data dinas tahun 2026, tercatat sekurang-kurangnya 500 data petani penerima yang masih dikelola secara terpisah-pisah menggunakan berkas Microsoft Word dan lembar kerja Excel manual. Hal ini memperlambat proses pencarian data, rekonsiliasi penerima, serta validasi status kelayakan OAP.
2. **Ketiadaan Validasi Lapangan yang Cepat bagi Petugas DAMRI**: Di halte atau titik kumpul kampung, petugas dan pengemudi bus DAMRI kesulitan memastikan apakah warga yang membawa muatan hasil bumi benar-benar petani OAP binaan resmi yang berhak atas subsidi tarif angkutan gratis Otsus. Tanpa instrumen verifikasi digital yang praktis, proses seleksi di lapangan memicu antrean atau potensi salah sasaran.
3. **Kebutuhan Akuntabilitas Penyaluran Dana Otsus**: Setiap rupiah dari belanja Dana Otonomi Khusus wajib didukung oleh bukti pertanggungjawaban (*evidence-based governance*) yang transparan dan dapat diaudit oleh BPK, BPKP, maupun Inspektorat Daerah, meliputi data *by name, by address*, titik asal keberangkatan, tonase komoditas yang diangkut, serta dokumentasi serah terima bantuan.

### 1.2 Dasar Hukum dan Landasan Kebijakan
1. Undang-Undang Nomor 2 Tahun 2021 tentang Perubahan Kedua atas Undang-Undang Nomor 21 Tahun 2001 tentang Otonomi Khusus bagi Provinsi Papua.
2. Peraturan Pemerintah Nomor 106 Tahun 2021 tentang Kewenangan dan Kelembagaan Pelaksanaan Kebijakan Otonomi Khusus Provinsi Papua.
3. Undang-Undang Nomor 19 Tahun 2013 tentang Perlindungan dan Pemberdayaan Petani.
4. Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE).
5. Dokumen Usulan Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor Nomor 400.10.5/205/IX/DISTAN/2026 tentang Pengembangan Aplikasi Kartu Tani Digital Berbasis QR Code untuk Mendukung Pengelolaan Data Petani, Program Bantuan Otonomi Khusus, dan Akses Transportasi Pemasaran Hasil Pangan Tahun 2026.

### 1.3 Rumusan Masalah
1. Bagaimana merancang dan membangun sistem informasi manajemen basis data petani OAP yang terpadu, mutakhir, dan terlindungi hak aksesnya di lingkungan Dinas Pertanian Kabupaten Biak Numfor?
2. Bagaimana merancang kartu identitas petani digital murni berbasis aplikasi yang dilengkapi nomor registrasi unik serta QR Code dinamis terenkripsi yang mampu divalidasi seketika (*realtime*) di lapangan tanpa bergantung pada kartu fisik PVC?
3. Bagaimana mengintegrasikan mekanisme verifikasi kartu tani digital dengan alur operasional pengangkutan komoditas DAMRI menggunakan kamera smartphone petugas DAMRI sehingga tercatat data manifes rute, komoditas, dan tonase hasil panen secara paperless?
4. Bagaimana menyajikan dashboard pemantauan eksekutif dan laporan akuntabilitas program bantuan Otsus bagi pimpinan daerah?

### 1.4 Maksud, Tujuan, dan Sasaran
* **Maksud**: Terwujudnya kerjasama profesional dan keahlian rekayasa teknologi informasi antara pengembang sistem (Ir. Denny Jean Cross Sihombing, S.T., M.T. yang juga merupakan Dosen Sistem Informasi Unika Atma Jaya Jakarta) dengan Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor dalam mendigitalisasi layanan penerima manfaat pertanian Otsus dan transportasi logistik pascapanen.
* **Tujuan**:
  1. Membangun perangkat lunak SIM-KARTANI berbasis web terintegrasi dan responsif mobile.
  2. Menyediakan instrumen identitas digital Kartu Tani OAP murni berbasis aplikasi web mobile dengan QR Code unik terenkripsi.
  3. Menyediakan modul pemindai QR Code untuk petugas DAMRI guna validasi cepat hak subsidi angkutan.
  4. Mencatat kronologis penyaluran program bantuan Otsus (bibit, pupuk, alsintan, dan subsidi ongkos angkut).
  5. Menyediakan laporan siap audit (*audit trail & exportable reports*).
* **Sasaran**:
  - Terekamnya 500+ data petani OAP terverifikasi di 10 distrik Biak Numfor.
  - Terselenggaranya operasional angkutan DAMRI perintis hasil pangan yang tepat sasaran.
  - Meningkatnya serapan hasil panen petani OAP di Pasar Tani Fandoi, Pasar Darfuar, dan Pasar Bosnik.

### 1.5 Ruang Lingkup Sistem
Ruang lingkup pekerjaan pengembangan perangkat lunak mencakup:
1. **Modul Manajemen Data Petani & Kelompok Tani**: Registrasi data identitas, NIK, wilayah (10 Distrik, 47+ Kampung), luas lahan, kelompok tani, dan komoditas utama.
2. **Modul Verifikasi & Penetapan Bertingkat**: Alur kerja verifikasi lapangan oleh Penyuluh Pertanian Lapangan (PPL) dan persetujuan penetapan resmi oleh Kepala Dinas/Kepala Bidang.
3. **Modul Penerbitan Kartu Tani Digital & QR Code Engine**: Pembuatan QR Code dinamis berbasis token kriptografis beresolusi tinggi pada aplikasi mobile/web portal petani OAP secara *paperless*.
4. **Modul Scanner Lapangan & Operasional DAMRI**: Pemindai QR berbasis web kamera ponsel (*HTML5 Camera Scanner*), validasi status kartu, dan pencatatan muatan perjalanan (*trip manifest*).
5. **Modul Portal Mandiri Petani OAP**: Akses mandiri bagi petani untuk melihat kartu digital, QR Code, riwayat bantuan yang diterima, dan riwayat trip angkutan DAMRI.
6. **Modul Program Bantuan & Penyaluran Otsus**: Pencatatan anggaran, pagu, jenis bantuan, kuota, dan riwayat serah terima fisik kepada penerima manfaat.
7. **Modul Dashboard Eksekutif & Pelaporan**: Visualisasi analitik grafik sebaran wilayah, komoditas, tonase terdistribusi, serta ekspor dokumen ber-Kop Surat resmi dan format CSV/Excel.
8. **RESTful API Gateway**: Jalur integrasi aman untuk aplikasi seluler DAMRI atau sistem eksternal Pemerintah Kabupaten.

---

## BAB II: RANCANG BANGUN & ARSITEKTUR SOLUSI

### 2.1 Metodologi Pengembangan (*Prototyping & Agile Iterative*)
Sesuai rekomendasi akademis dan kondisi geografis lapangan Kabupaten Biak Numfor, pengembangan menerapkan metode **Prototyping & Agile**, yang terbagi dalam 8 tahapan terstruktur:
1. **Studi Literatur & Regulasi**: Pendalaman regulasi Otsus Papua, SOP dinas, dan ketentuan operasional DAMRI.
2. **Analisis Kebutuhan Sistem & User Story**: Wawancara mendalam pemangku kepentingan (*stakeholders* dinas, perwakilan kelompok tani, koordinator DAMRI).
3. **Desain Arsitektur & Wireframe UI/UX**: Pembuatan Entity Relationship Diagram (ERD), skema basis data, dan antarmuka ramah pengguna (*clean & professional*).
4. **Pengembangan Prototipe Fungsional**: Pembangunan modul inti (CRUD Petani, Generate QR, Scanner, Record Manifest).
5. **Evaluasi Pengguna (User Review)**: Demonstrasi berkala bersama tim teknis dinas untuk mendapatkan masukan penyempurnaan fitur.
6. **Implementasi Sistem Menyeluruh**: Penulisan kode program final, integrasi basis data MySQL, pengamanan sesi, dan optimasi performa.
7. **Pengujian Menyeluruh (UAT, Security, & Stress Testing)**: Pengujian fungsionalitas tombol, validasi formulir, respon scanner pada berbagai kondisi pencahayaan, dan uji beban.
8. **Pelatihan (TOT), Pendampingan, & Serah Terima**: Pelatihan operator dinas, penyuluh PPL, driver/petugas DAMRI, serta penyerahan source code dan dokumentasi teknis.

```
[Analisis Kebutuhan] ──> [Desain UI/UX & DB] ──> [Prototipe Fungsional] ──> [Evaluasi Pengguna]
                                                            │                         │
                                                            └── Masukan Revisi <──────┘
                                                                        │
                                                                        ▼
                                                         [Implementasi Sistem Penuh]
                                                                        │
                                                                        ▼
                                                       [UAT & Pengujian Lapangan Biak]
                                                                        │
                                                                        ▼
                                                     [Training TOT & Serah Terima Resmi]
```

### 2.2 Arsitektur Sistem & Spesifikasi Teknologi
Arsitektur dirancang dengan prinsip *High Availability*, *Data Integrity*, dan *Lightweight Client* agar dapat berjalan optimal pada jaringan internet di distrik-distrik kepulauan:

* **Sisi Server (Backend)**: Node.js Enterprise Engine dengan framework Express.js, arsitektur modular MVC (*Model-View-Controller*).
* **Sisi Basis Data (Database)**: MySQL 8.x / MariaDB Enterprise, skema relasional 9 tabel utama berindeks lengkap (*users, distrik, kampung, kelompok_tani, petani, program_bantuan, penyaluran_bantuan, transportasi_damri, audit_log*).
* **Sisi Klien (Frontend)**: Responsive Web Design berbasis Tailwind CSS, Plus Jakarta Sans typography, Chart.js untuk analitik grafik, dan antarmuka cetak resolusi tinggi (*Print-ready CSS*).
* **Teknologi QR Code & Scanner**: Enkripsi token berbasis Node-QRCode dan HTML5-QRCode Scanner multi-platform tanpa memerlukan instalasi aplikasi tambahan dari Play Store (cukup melalui browser Google Chrome di ponsel pintar).
* **Keamanan Sistem**:
  - Hashing sandi menggunakan fungsi `scrypt` dengan salt 128-bit acak.
  - Sesi berbasis Cookie bertanda tangan kriptografis HMAC-SHA256.
  - Perlindungan terhadap injeksi SQL (*Prepared Statements*), XSS, dan CSRF.
  - Pencatatan jejak audit (*Audit Trail Logging*) setiap kali terjadi perubahan status verifikasi, penerbitan kartu, dan transaksi logistik.

### 2.3 Mekanisme Integrasi Transportasi DAMRI
1. Petani OAP mendatangi titik kumpul halte DAMRI dengan membawa hasil panen dan menunjukkan Kartu Tani (baik kartu fisik maupun tampilan layar ponsel).
2. Petugas DAMRI membuka menu **Pemindai QR** di ponsel pintarnya.
3. Kamera membaca QR Code dan sistem mengirim permintaan verifikasi ke endpoint `/api/verify-card`.
4. Sistem memeriksa status di database MySQL:
   - Jika `status_kartu == 'aktif'` dan `status_verifikasi == 'ditetapkan'`, layar menampilkan warna **Hijau (VALID)** beserta foto, nama petani, kampung asal, dan komoditas binaan. Petugas menekan tombol **"Layani & Catat Angkutan"**.
   - Jika status kartu tidak aktif atau ditolak, layar menampilkan warna **Merah (DITOLAK)** beserta keterangan alasan penolakan sehingga subsidi tarif tidak dapat diberikan.
5. Pada form manifest, petugas menginput komoditas (misal: 100 Kg Keladi), pasar tujuan (*Pasar Tani Fandoi / Darfuar / Bosnik*), armada DAMRI, lalu menyimpan data.
6. Data perjalanan langsung terakumulasi ke dalam dashboard pimpinan dan riwayat pribadi petani.

---

## BAB III: SUSUNAN TIM AHLI & STRUKTUR PELAKSANA

Kegiatan rancang bangun dan implementasi sistem ini dipimpin langsung oleh **Ir. Denny Jean Cross Sihombing, S.T., M.T.** bertindak sebagai Pengembang Utama & Arsitek Perangkat Lunak (yang juga merupakan Dosen Tetap Program Studi Sistem Informasi Universitas Katolik Indonesia Atma Jaya Jakarta), didukung oleh tim rekayasa sistem profesional berpengalaman:

| No | Posisi / Jabatan | Nama Personel | Kualifikasi & Peran Pokok |
|:--:|---|---|---|
| 1 | **Ketua Tim / Lead Software Architect** | **Ir. Denny Jean Cross Sihombing, S.T., M.T.** | Magister Teknik Informatika/Sistem Informasi, Dosen Tetap Sistem Informasi Unika Atma Jaya Jakarta, Praktisi Pengembang Sistem. Bertanggung jawab atas kepemimpinan proyek, koordinasi tingkat tinggi dengan Dinas Pertanian Biak Numfor, perancangan arsitektur enterprise, kendali mutu perangkat lunak, dan supervisi metodologi. |
| 2 | **System Analyst & Business Process Specialist** | **Dian Violin Kapisa** | Sarjana Sistem Informasi, peneliti domain spesifik pertanian Biak Numfor. Bertanggung jawab atas elisitasi kebutuhan fungsional, analisis alur proses bisnis subsidi Otsus dan angkutan DAMRI, pemodelan proses use case/activity, validasi data 500+ petani OAP, serta modul pengujian fungsional. |
| 3 | **Senior Software Engineer & Database Architect** | **Tenaga Ahli Rekayasa Perangkat Lunak (Senior Fullstack)** | Pengalaman >7 tahun rekayasa perangkat lunak Node.js, Express, dan basis data relasional MySQL. Bertanggung jawab atas perancangan skema basis data teroptimasi, implementasi logika backend, integrasi HTML5 QR Code Scanner, antarmuka web responsif mobile, dan keamanan sistem. |

---

## BAB IV: JADWAL & TAHAPAN PELAKSANAAN PROYEK (4 BULAN KALENDER)

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
| 10 | Penyusunan Laporan Akhir, Berita Acara Serah Terima (BAST), & Pendampingan Go-Live | | | | ████ |

---

## BAB V: RENCANA ANGGARAN BIAYA (RAB) LENGKAP (4 BULAN PEKERJAAN)

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

## BAB VI: LUARAN KEGIATAN (DELIVERABLES) & KEBERLANJUTAN

Luaran resmi yang akan diserahterimakan kepada Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor meliputi:

1. **Perangkat Lunak Sistem Informasi Lengkap (*Full Production Ready*)**:
   - Web application SIM-KARTANI yang telah terpasang pada server produksi.
   - Hak akses penuh untuk seluruh tingkatan pengguna (Admin, Petugas PPL, Kepala Dinas, Petugas DAMRI, dan Petani OAP).
2. **Paket Source Code & Database Schema**:
   - Seluruh repositori kode sumber (Node.js/Express) bebas royalti (*Open Academic License*).
   - Skema basis data terstruktur MySQL (DDL, Data Dictionary, Initial Seed Scripts 500 Petani).
3. **Kartu Tani Fisik & Digital Percontohan**:
   - 500 Keping Kartu Tani OAP berbahan PVC siap edar yang telah dicetak lengkap dengan foto, nama, nomor unik, dan QR Code terverifikasi.
4. **Dokumentasi Teknis & Panduan Operasional**:
   - Buku Panduan Administrator Sistem (*Admin Manual*).
   - Buku Panduan Petugas Verifikator Lapangan & Operator DAMRI (*Field Manual*).
   - Dokumen Arsitektur Sistem, ERD, dan Spesifikasi REST API.
5. **Video Tutorial & Bahan Tayang Pelatihan**:
   - Video simulasi pemindaian QR Code di halte bus DAMRI.
   - Video tutorial verifikasi dan persetujuan Kepala Dinas.
6. **Berita Acara Pelatihan (*Training of Trainers*)**:
   - Sertifikat pelatihan untuk aparatur dinas dan staf operasional DAMRI yang telah lulus uji kompetensi operasional aplikasi.
7. **Jaminan Pemeliharaan (*SLA & Warranty*)**:
   - Pendampingan teknis dan perbaikan kendala (*bug fixing*) gratis selama 6 bulan kalender pasca penandatanganan Berita Acara Serah Terima (BAST).

---

## BAB VII: PENUTUP & LEMBAR PENGESAHAN

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
