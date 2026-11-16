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
5. [BAB IV: Jadwal & Tahapan Pelaksanaan Proyek (4 Bulan)](#bab-iv-jadwal--tahapan-pelaksanaan-proyek-4-bulan)
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
