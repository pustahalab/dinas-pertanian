const fs = require('fs');

let md = fs.readFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md', 'utf8');

// Replace executive summary
md = md.replace(
  /Total usulan anggaran biaya pengembangan.*?(?=\n\n---)/s,
  'Total usulan anggaran biaya pengembangan, implementasi infrastruktur cloud berkinerja tinggi, pengujian lapangan di Biak Numfor, sosialisasi, pelatihan (*TOT*), hingga serah terima sistem digital murni berbasis aplikasi adalah sebesar **Rp 296.450.000,- (Dua Ratus Sembilan Puluh Enam Juta Empat Ratus Lima Puluh Ribu Rupiah)** untuk durasi pekerjaan selama **6 (enam) bulan**. Sesuai arahan efisiensi dan modernisasi tata kelola digital (*paperless & digital-native*), sistem beroperasi secara penuh melalui aplikasi web mobile dan pemindai QR Code di smartphone tanpa memerlukan pengadaan kartu fisik PVC maupun mesin cetak termal.'
);

// Replace Bab 1.3 & 1.4 mentions of physical card
md = md.replace(
  '2. Bagaimana merancang kartu identitas petani digital dan fisik yang dilengkapi nomor registrasi unik serta QR Code terenkripsi yang mampu divalidasi secara seketika (*realtime*) di lapangan?',
  '2. Bagaimana merancang kartu identitas petani digital murni berbasis aplikasi yang dilengkapi nomor registrasi unik serta QR Code dinamis terenkripsi yang mampu divalidasi seketika (*realtime*) di lapangan tanpa bergantung pada kartu fisik PVC?'
);

md = md.replace(
  '3. Bagaimana mengintegrasikan mekanisme verifikasi kartu tani dengan alur operasional pengangkutan komoditas DAMRI sehingga tercatat data manifes rute, komoditas, dan tonase hasil panen?',
  '3. Bagaimana mengintegrasikan mekanisme verifikasi kartu tani digital dengan alur operasional pengangkutan komoditas DAMRI menggunakan kamera smartphone petugas DAMRI sehingga tercatat data manifes rute, komoditas, dan tonase hasil panen secara paperless?'
);

md = md.replace(
  '2. Menyediakan instrumen penerbitan Kartu Tani OAP digital serta cetak massal (*batch print*).',
  '2. Menyediakan instrumen identitas digital Kartu Tani OAP murni berbasis aplikasi web mobile dengan QR Code unik terenkripsi.'
);

md = md.replace(
  '3. **Modul Penerbitan Kartu Tani Digital & QR Code Engine**: Pembuatan QR Code dinamis berbasis token kriptografis beresolusi tinggi beserta fitur cetak lembar fisik massal.',
  '3. **Modul Penerbitan Kartu Tani Digital & QR Code Engine**: Pembuatan QR Code dinamis berbasis token kriptografis beresolusi tinggi pada aplikasi mobile/web portal petani OAP secara *paperless*.'
);

// Replace Bab III Susunan Tim Ahli
const bab3Regex = /## BAB III: SUSUNAN TIM AHLI & STRUKTUR PELAKSANA[\s\S]*?(?=\n\n---)/;
const newBab3 = `## BAB III: SUSUNAN TIM AHLI & STRUKTUR PELAKSANA

Kegiatan rancang bangun dan implementasi ini dipimpin langsung oleh Tenaga Ahli Akademisi dari Unika Atma Jaya Jakarta didukung oleh tim rekayasa perangkat lunak inti yang berpengalaman:

| No | Posisi / Jabatan | Nama Personel | Kualifikasi & Peran Pokok |
|:--:|---|---|---|
| 1 | **Ketua Tim Pelaksana (Team Leader / Principal Investigator)** | **Ir. Denny Jean Cross Sihombing, S.T., M.T.** | Magister Teknik Informatika/Sistem Informasi, Dosen Tetap Program Studi Sistem Informasi Unika Atma Jaya Jakarta. Bertanggung jawab atas kepemimpinan proyek secara menyeluruh, koordinasi tingkat tinggi dengan Pemerintah Kabupaten Biak Numfor, perancangan arsitektur sistem enterprise, kendali mutu perangkat lunak, dan supervisi metodologi ilmiah. |
| 2 | **System Analyst & Business Process Specialist** | Dian Violin Kapisa | Sarjana Sistem Informasi, peneliti domain spesifik pertanian Biak Numfor. Bertanggung jawab atas elisitasi kebutuhan pengguna, analisis alur proses bisnis subsidi Otsus dan angkutan DAMRI, pemodelan use case/activity, validasi data 500+ petani OAP, serta penyusunan modul pengujian fungsional. |
| 3 | **Senior Software Engineer & Database Architect** | Tenaga Ahli Rekayasa Perangkat Lunak (Senior Fullstack) | Praktisi senior pengalaman >7 tahun arsitektur Node.js, Express, dan basis data relasional MySQL. Bertanggung jawab atas perancangan skema database teroptimasi, implementasi logika backend, integrasi modul QR Code Scanner, antarmuka web responsif, enkripsi sesi, dan pengamanan sistem. |`;

md = md.replace(bab3Regex, newBab3);

// Replace Bab V RAB
const bab5Regex = /## BAB V: RENCANA ANGGARAN BIAYA \(RAB\) LENGKAP[\s\S]*?(?=## BAB VI: LUARAN KEGIATAN)/;
const bab5Content = `## BAB V: RENCANA ANGGARAN BIAYA (RAB) LENGKAP

Rencana Anggaran Biaya (RAB) disusun berdasarkan prinsip efisiensi, akuntabilitas, standar biaya masukan yang wajar, serta penyesuaian kebutuhan riil di lapangan. Sesuai dengan spesifikasi modernisasi digital, sistem dirancang murni berbasis aplikasi (*paperless & digital-native*) menggunakan identitas digital dan pemindai QR Code kamera smartphone, sehingga tidak memerlukan biaya pengadaan kartu fisik PVC maupun perangkat keras percetakan tambahan.

### 5.1 Rincian Biaya per Komponen Kegiatan

#### Komponen 1: Honorarium Tenaga Ahli Inti
| No | Uraian Tenaga Ahli | Volume | Satuan | Biaya Satuan (Rp) | Subtotal (Rp) |
|:--:|---|:---:|:---:|---:|---:|
| 1.1 | Ketua Tim / Team Leader (Ir. Denny Jean Cross Sihombing, S.T., M.T.) | 6 | Orang/Bulan (OB) | 12.500.000 | 75.000.000 |
| 1.2 | System Analyst & Business Process Specialist (Dian Violin Kapisa) | 6 | Orang/Bulan (OB) | 7.500.000 | 45.000.000 |
| 1.3 | Senior Software Engineer & Database Architect | 5 | Orang/Bulan (OB) | 9.000.000 | 45.000.000 |
| **Subtotal Komponen 1** | | | | | **Rp 165.000.000** |

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

### 5.2 Rekapitulasi Rencana Anggaran Biaya (RAB)

| No | Komponen Anggaran | Jumlah Biaya (Rp) | Persentase (%) |
|:--:|---|---:|:---:|
| 1 | **Komponen 1: Honorarium Tenaga Ahli Inti** | 165.000.000 | 55,66% |
| 2 | **Komponen 2: Infrastruktur Cloud Server, Domain, Database, & Lisensi** | 50.550.000 | 17,05% |
| 3 | **Komponen 3: Operasional Lapangan, Koordinasi, & Perjalanan Dinas ke Biak Numfor** | 61.100.000 | 20,61% |
| 4 | **Komponen 4: Pelatihan (TOT), Sosialisasi, Modul Panduan, & Dokumentasi Akhir** | 19.800.000 | 6,68% |
| | **TOTAL KESELURUHAN ANGGARAN BIAYA** | **Rp 296.450.000** | **100,00%** |

*(Terbilang: **Dua Ratus Sembilan Puluh Enam Juta Empat Ratus Lima Puluh Ribu Rupiah**)*

> **Catatan Finansial**:
> 1. Anggaran telah memperhitungkan seluruh biaya alih pengetahuan (*transfer of knowledge*), penyediaan hak pakai kode sumber tanpa royalti berkala (*royalty-free source code*), serta pendampingan masa garansi (*maintenance support*) selama **6 (enam) bulan pasca serah terima**.
> 2. Besaran anggaran dapat disesuaikan kembali berdasarkan skema kemitraan swakelola tipe II antara Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor dengan Lembaga Penelitian dan Pengabdian kepada Masyarakat (LPPM) Unika Atma Jaya Jakarta sesuai dengan regulasi pengadaan barang dan jasa pemerintah (LKPP).

---

`;

md = md.replace(bab5Regex, bab5Content);

fs.writeFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md', md, 'utf8');
console.log('Successfully updated docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md');
