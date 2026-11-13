# PROPOSAL PENGEMBANGAN DAN IMPLEMENTASI
## SISTEM INFORMASI MANAJEMEN KARTU TANI OAP (ORANG ASLI PAPUA) TERINTEGRASI LAYANAN TRANSPORTASI DAMRI
### Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor, Provinsi Papua

---

**Nomor Usulan** : 024/P-SI/FBTI-UAJ/XI/2026  
**Lampiran** : 1 (Satu) Berkas Lengkap Rencana Anggaran Biaya (RAB)  
**Perihal** : Permohonan dan Pengajuan Kerja Sama Rancang Bangun & Implementasi Sistem Informasi Manajemen Kartu Tani OAP Terintegrasi Layanan Transportasi DAMRI  

**Kepada Yth.**  
**Plt. Kepala Dinas Pertanian dan Ketahanan Pangan**  
**Kabupaten Biak Numfor**  
**Bapak drh. BAMBANG HAYANTO**  
di -  
&nbsp;&nbsp;&nbsp;&nbsp;Biak Numfor, Provinsi Papua  

---

### IDENTITAS PENGUSUL
* **Nama Pengusul** : Ir. Denny Jean Cross Sihombing, S.T., M.T.
* **NIDN / NIP** : 0315087501
* **Jabatan** : Dosen Program Studi Sistem Informasi
* **Institusi** : Fakultas Biosains, Teknologi, dan Inovasi (FBTI), Universitas Katolik Indonesia Atma Jaya Jakarta
* **Alamat Institusi** : Jl. Jenderal Sudirman No. 51, Semanggi, Jakarta Selatan 12930
* **Email / Kontak** : denny.sihombing@atmajaya.ac.id / +62 812-9876-XXXX
* **Bidang Keahlian** : Rekayasa Sistem Informasi, Tata Kelola TI Pemerintah (*E-Government*), Arsitektur Basis Data & Perangkat Lunak Enterprise

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
5. [BAB IV: Jadwal & Tahapan Pelaksanaan Proyek (6 Bulan)](#bab-iv-jadwal--tahapan-pelaksanaan-proyek)
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

Total usulan anggaran biaya pengembangan, implementasi infrastruktur, pengujian lapangan di Biak Numfor, sosialisasi, pelatihan (*TOT*), hingga serah terima lisensi penuh adalah sebesar **Rp 385.750.000,- (Tiga Ratus Delapan Puluh Lima Juta Tujuh Ratus Lima Puluh Ribu Rupiah)** untuk durasi pekerjaan selama **6 (enam) bulan**.

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
2. Bagaimana merancang kartu identitas petani digital dan fisik yang dilengkapi nomor registrasi unik serta QR Code terenkripsi yang mampu divalidasi secara seketika (*realtime*) di lapangan?
3. Bagaimana mengintegrasikan mekanisme verifikasi kartu tani dengan alur operasional pengangkutan komoditas DAMRI sehingga tercatat data manifes rute, komoditas, dan tonase hasil panen?
4. Bagaimana menyajikan dashboard pemantauan eksekutif dan laporan akuntabilitas program bantuan Otsus bagi pimpinan daerah?

### 1.4 Maksud, Tujuan, dan Sasaran
* **Maksud**: Terwujudnya kemitraan strategis tridharma perguruan tinggi antara Program Studi Sistem Informasi Unika Atma Jaya Jakarta dengan Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor dalam mendigitalisasi layanan pertanian dan transportasi logistik pascapanen.
* **Tujuan**:
  1. Membangun perangkat lunak SIM-KARTANI berbasis web terintegrasi dan responsif mobile.
  2. Menyediakan instrumen penerbitan Kartu Tani OAP digital serta cetak massal (*batch print*).
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
3. **Modul Penerbitan Kartu Tani Digital & QR Code Engine**: Pembuatan QR Code dinamis berbasis token kriptografis beresolusi tinggi beserta fitur cetak lembar fisik massal.
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

Kegiatan rancang bangun dan implementasi ini dipimpin langsung oleh Tenaga Ahli Akademisi dari Unika Atma Jaya Jakarta didukung oleh tim rekayasa perangkat lunak dan tenaga pendamping lapangan:

| No | Posisi / Jabatan | Nama Personel | Kualifikasi & Peran Pokok |
|:--:|---|---|---|
| 1 | **Ketua Tim Pelaksana (Team Leader / Principal Investigator)** | **Ir. Denny Jean Cross Sihombing, S.T., M.T.** | Magister Teknik Informatika/Sistem Informasi, Dosen Tetap Unika Atma Jaya. Bertanggung jawab atas keseluruhan manajemen proyek, koordinasi kelembagaan dinas, perancangan arsitektur enterprise, kendali mutu, dan supervisi metodologi. |
| 2 | **System Analyst & Business Process Specialist** | Dian Violin Kapisa | Sarjana Sistem Informasi, peneliti domain spesifik pertanian Biak Numfor. Bertanggung jawab atas rekayasa kebutuhan fungsional, analisis alur proses bisnis dinas-DAMRI, dan perancangan use case. |
| 3 | **Senior Software Engineer & Database Architect** | Tenaga Ahli Rekayasa Perangkat Lunak (Senior) | Pengalaman >7 tahun fullstack Node.js & MySQL. Bertanggung jawab atas penulisan core backend, arsitektur basis data, keamanan transaksi, dan REST API. |
| 4 | **UI/UX Designer & Frontend Developer** | Desainer Produk Digital & Frontend Specialist | Pengalaman >5 tahun desain UI/UX pemerintahan dan mobile-first responsive web design. Bertanggung jawab atas antarmuka, tata letak kartu cetak, dan dashboard. |
| 5 | **Hardware Integration & QA/Security Tester** | Spesialis Pengujian Sistem & Integrasi Scanner | Bertanggung jawab atas pengujian kompabilitas kamera QR berbagai tipe ponsel, stress testing, UAT, dan pengujian kerentanan keamanan web. |
| 6 | **Field Implementation & Training Specialist** | Tenaga Pendamping Lapangan (Biak) | Bertanggung jawab atas fasilitasi sosialisasi lapangan di Biak Numfor, pendampingan operator dinas, koordinator distrik, dan petugas lapangan DAMRI. |

---

## BAB IV: JADWAL & TAHAPAN PELAKSANAAN PROYEK

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
| 10 | Pelatihan Operator (*Training of Trainers / TOT*), Penyusunan Dokumentasi, & Serah Terima | | | | | | ████ |

---

## BAB V: RENCANA ANGGARAN BIAYA (RAB) LENGKAP

Rencana Anggaran Biaya (RAB) disusun berdasarkan standar biaya masukan pemerintah daerah, prinsip efisiensi, akuntabilitas, dan ketercapaian target luaran yang bernilai guna tinggi bagi Pemerintah Kabupaten Biak Numfor.

### 5.1 Rincian Biaya per Komponen Kegiatan

#### Komponen 1: Honorarium Tenaga Ahli & Tim Pengembang
| No | Uraian Tenaga Ahli | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 1.1 | Team Leader / Principal Investigator (Ir. Denny Jean Cross Sihombing, S.T., M.T.) | 6 | Orang/Bulan (OB) | 12.500.000 | 75.000.000 |
| 1.2 | System Analyst & Business Process Specialist | 6 | Orang/Bulan (OB) | 7.500.000 | 45.000.000 |
| 1.3 | Senior Backend & Database Engineer | 5 | Orang/Bulan (OB) | 9.000.000 | 45.000.000 |
| 1.4 | Frontend Developer & UI/UX Specialist | 4 | Orang/Bulan (OB) | 7.000.000 | 28.000.000 |
| 1.5 | QA Tester & Security Assessment Specialist | 3 | Orang/Bulan (OB) | 6.000.000 | 18.000.000 |
| 1.6 | Field Implementation & Training Specialist (Biak) | 4 | Orang/Bulan (OB) | 5.500.000 | 22.000.000 |
| **Subtotal Komponen 1** | | | | | **Rp 233.000.000** |

#### Komponen 2: Infrastruktur Cloud Server, Domain, Database, & Lisensi Pendukung (Tahun Pertama)
| No | Uraian Infrastruktur & Lisensi | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 2.1 | Cloud Virtual Private Server (VPS Enterprise, 8 vCPU, 16 GB RAM, NVMe SSD) | 12 | Bulan | 1.850.000 | 22.200.000 |
| 2.2 | Managed Relational Database Service (MySQL High Availability Backup) | 12 | Bulan | 1.100.000 | 13.200.000 |
| 2.3 | Domain Resmi Pemerintah Daerah (.go.id / biakkab.go.id) & SSL Certificate Wildcard 2 Tahun | 1 | Paket | 2.850.000 | 2.850.000 |
| 2.4 | Cloud Storage & Object Backup Service (Penyimpanan Foto Petani & Dokumen Verifikasi) | 12 | Bulan | 650.000 | 7.800.000 |
| 2.5 | Layanan Gateway Pengiriman Notifikasi & SMS/WA Verifikasi Petani | 1 | Paket | 4.500.000 | 4.500.000 |
| **Subtotal Komponen 2** | | | | | **Rp 50.550.000** |

#### Komponen 3: Pengadaan Perangkat Uji Coba, Bahan Cetak Kartu, & Sarana Scanner
| No | Uraian Perangkat & Perlengkapan | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 3.1 | Handheld Tablet / Smartphone Scanner Lapangan untuk Petugas DAMRI (Rugged Device 4G) | 2 | Unit | 3.750.000 | 7.500.000 |
| 3.2 | Bahan Cetak Kartu Fisik PVC Standar ISO (Blank Card PVC Preprinted Gold Emblem, Barcode, Hologram Pengaman Otsus) untuk 500 Petani | 500 | Keping | 15.000 | 7.500.000 |
| 3.3 | Ribbon & Perlengkapan Thermal ID Card Printer untuk Percetakan Mandiri di Dinas | 2 | Roll/Set | 1.800.000 | 3.600.000 |
| 3.4 | Standee Akrilik Barcode Titik Halte / Pos Kumpul DAMRI (10 Distrik Sentra Panen) | 10 | Set | 350.000 | 3.500.000 |
| **Subtotal Komponen 3** | | | | | **Rp 22.100.000** |

#### Komponen 4: Operasional Lapangan, Koordinasi, & Perjalanan Dinas ke Biak Numfor
| No | Uraian Perjalanan Dinas & Operasional | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 4.1 | Tiket Pesawat PP Jakarta - Biak (Tim Ahli 2 Orang x 2 Kunjungan: Kick-Off & UAT/Training) | 4 | Tiket PP | 6.500.000 | 26.000.000 |
| 4.2 | Akomodasi & Penginapan Tim Ahli di Biak Numfor (2 Orang x 7 Hari x 2 Kunjungan) | 28 | Hari/Orang | 650.000 | 18.200.000 |
| 4.3 | Transportasi Lokal Lapangan (Sewa Kendaraan Roda 4 Survei 10 Distrik Biak Numfor) | 14 | Hari | 750.000 | 10.500.000 |
| 4.4 | Uang Harian Perjalanan Dinas Tim Ahli sesuai SBM Daerah | 28 | Hari/Orang | 450.000 | 12.600.000 |
| **Subtotal Komponen 4** | | | | | **Rp 67.300.000** |

#### Komponen 5: Pelatihan (*Training of Trainers*), Sosialisasi, Dokumentasi, & Pelaporan
| No | Uraian Kegiatan Pelatihan & Pelaporan | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 5.1 | Konsumsi & Paket Fasilitasi Workshop Pelatihan Operator Dinas & Petugas DAMRI (35 Peserta x 2 Hari) | 70 | Orang/Hari | 125.000 | 8.750.000 |
| 5.2 | Penggandaan Modul Buku Panduan Administrator, Petugas PPL, dan Supir DAMRI (Cetak Full Color Glossy) | 50 | Buku | 95.000 | 4.750.000 |
| 5.3 | Pembuatan Video Panduan Penggunaan (*Video Tutorial Animasi & Live Demo*) | 1 | Paket | 4.500.000 | 4.500.000 |
| 5.4 | Penyusunan Berkas Laporan Akhir Proyek, Arsitektur Sistem, & Berita Acara Serah Terima (Hardcover) | 5 | Eksemplar | 360.000 | 1.800.000 |
| **Subtotal Komponen 5** | | | | | **Rp 19.800.000** |

---

### 5.2 Rekapitulasi Rencana Anggaran Biaya (RAB)

| No | Komponen Anggaran | Jumlah Biaya (Rp) | Persentase (%) |
|:--:|---|---:|:---:|
| 1 | **Komponen 1: Honorarium Tenaga Ahli & Tim Pengembang Perangkat Lunak** | 233.000.000 | 60,40% |
| 2 | **Komponen 2: Infrastruktur Cloud Server, Domain, Database, & Lisensi** | 50.550.000 | 13,10% |
| 3 | **Komponen 3: Pengadaan Perangkat Uji Coba, Bahan Cetak Kartu, & Sarana Scanner** | 22.100.000 | 5,73% |
| 4 | **Komponen 4: Operasional Lapangan, Koordinasi, & Perjalanan Dinas ke Biak Numfor** | 67.300.000 | 17,45% |
| 5 | **Komponen 5: Pelatihan (TOT), Sosialisasi, Modul Panduan, & Dokumentasi Akhir** | 19.800.000 | 5,13% |
| | **TOTAL KESELURUHAN ANGGARAN BIAYA** | **Rp 392.750.000** | **100,00%** |

*(Terbilang: **Tiga Ratus Sembilan Puluh Dua Juta Tujuh Ratus Lima Puluh Ribu Rupiah**)*

> **Catatan Finansial**:
> 1. Anggaran telah memperhitungkan seluruh biaya alih pengetahuan (*transfer of knowledge*), penyediaan hak pakai kode program tanpa royalti berkala (*royalty-free source code*), serta pendampingan masa garansi (*maintenance support*) selama **6 (enam) bulan pasca serah terima**.
> 2. Besaran anggaran dapat disesuaikan kembali berdasarkan skema kemitraan swakelola tipe II antara Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor dengan Lembaga Penelitian dan Pengabdian kepada Masyarakat (LPPM) Unika Atma Jaya Jakarta sesuai dengan regulasi pengadaan barang dan jasa pemerintah (LKPP).

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

Penerapan Sistem Informasi Manajemen Kartu Tani OAP Terintegrasi Layanan Transportasi DAMRI ini bukan semata-mata implementasi teknologi informasi, melainkan langkah strategis pemerintah daerah dalam mewujudkan **keadilan sosial dan kemandirian ekonomi bagi masyarakat Orang Asli Papua (OAP)** di Kabupaten Biak Numfor.

Dengan sistem ini, Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor akan memiliki basis data pertanian yang akurat, penyaluran bantuan Otonomi Khusus yang tepat sasaran, serta kepastian logistik transportasi yang menghubungkan petani dari kebun langsung ke pasar konsumen.

Besar harapan kami usulan proposal ini dapat disetujui dan ditindaklanjuti dalam bentuk Perjanjian Kerja Sama (PKS) atau Kontrak Kerja Sama Swakelola. Atas perhatian, kepercayaan, dan kerja sama yang baik dari Bapak Plt. Kepala Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor beserta jajaran, kami haturkan terima kasih.

---

Jakarta, 13 November 2026  

**Hormat Kami,**  
**Ketua Tim Pengusul / Pengembang,**  

<br><br><br>

**<u>Ir. Denny Jean Cross Sihombing, S.T., M.T.</u>**  
Dosen Program Studi Sistem Informasi  
Fakultas Biosains, Teknologi, dan Inovasi (FBTI)  
Universitas Katolik Indonesia Atma Jaya Jakarta  
NIDN : 0315087501  

---

**Menyetujui / Mengetahui,**  
**Dekan Fakultas Biosains, Teknologi, dan Inovasi**  
**Universitas Katolik Indonesia Atma Jaya**  

<br><br><br>

**<u>Dr. Ir. Y. B. Suhartono, M.Sc.</u>**  
NIP : 19680415 199303 1 002  
