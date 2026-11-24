# PANDUAN SISTEM E-SIGN & GENERATOR TANDA TANGAN DIGITAL
**Laman Resmi:** `dennyjcs.com/e-sign`  
**Panel Generator:** `dennyjcs.com/e-sign/generator.php`  
**Pemilik:** Ir. Denny Jean Cross Sihombing, S.T., M.T.  

---

## 1. STRUKTUR FOLDER DI CPANEL (`public_html/e-sign/`)

Cukup unggah 3 berkas dari folder `cpanel_esign/` ini ke dalam folder `public_html/e-sign/` di cPanel hosting Anda:

```text
public_html/
└── e-sign/
    ├── index.php         <--- Portal Verifikasi Publik (saat QR Code dipindai mitra)
    ├── generator.php     <--- Panel Generator Pembuatan Tanda Tangan & Cap PDF (Akses PIN)
    └── documents.json    <--- Basis data dokumen resmi terdaftar (otomatis bertambah)
```

---

## 2. CARA MENGGUNAKAN GENERATOR E-SIGN MANDIRI

Mulai sekarang, Anda **TIDAK PERLU** lagi mengedit kode pemrograman atau meminta bantuan teknis setiap kali membuat proposal/surat baru:

1. **Buka Panel Generator di Browser**:
   * Akses: `https://dennyjcs.com/e-sign/generator.php`
   * Masukkan **PIN Keamanan**: `1977` *(PIN ini bisa Anda ubah di baris 15 file generator.php)*.

2. **Isi Formulir Dokumen Baru**:
   * Judul Proposal / Dokumen (contoh: *Proposal Sistem Informasi X...*)
   * Nomor Dokumen (contoh: *015/EXT-PROP/DJCS/XI/2026*)
   * Instansi Mitra / Tujuan (contoh: *Dinas Komunikasi dan Informatika*)
   * Nilai Anggaran / RAB (opsional)
   * Durasi & Tanggal Dokumen
   * Klik tombol **"⚡ Daftarkan Dokumen & Buat E-Sign Sekarang"**.

3. **Dokumen Otomatis Terdaftar**:
   * Dokumen langsung tercatat di `documents.json` dan seketika berstatus **VALID** di portal verifikasi `dennyjcs.com/e-sign`.

4. **Dua Cara Menempelkan Tanda Tangan ke Dokumen Anda**:

   * **Cara A: Unduh Gambar Stempel PNG (Transparan 300 DPI)**:
     * Klik tombol hijau: **"📥 Unduh Stempel TTD PNG (Transparan)"**.
     * Gambar tanda tangan resmi ber-QR Code dengan latar belakang transparan murni akan terunduh.
     * Buka dokumen Anda di **Microsoft Word**, **Google Docs**, **Canva**, atau **Adobe Acrobat / Foxit**, lalu cukup pilih menu **Insert Picture / Gambar** dan tempatkan di bagian tanda tangan (persis seperti menempelkan tanda tangan basah).

   * **Cara B: Tempel Otomatis Langsung ke File PDF (Tab "Tempel ke PDF")**:
     * Buka tab **"📄 Tempel ke PDF (PDF Stamper)"**.
     * Pilih file PDF Anda dari komputer.
     * Pilih halaman penempelan (*Halaman Terakhir* atau nomor tertentu) dan posisi (*Kanan Bawah*).
     * Klik **"🚀 Tempelkan Stempel & Unduh PDF Resmi Sekarang"**.
     * PDF bertanda tangan resmi siap kirim akan terunduh dalam 1 detik langsung di browser tanpa perlu mengunggah dokumen Anda ke server luar.

---

## 3. PENGUJIAN VERIFIKASI KEABSAHAN

Saat pihak instansi mitra, bupati, kepala dinas, atau reviewer jurnal memindai QR Code yang tertempel pada dokumen fisik atau file PDF Anda:
* Browser mereka langsung membuka `https://dennyjcs.com/e-sign?doc=...`
* Menampilkan kartu pengesahan **"DOKUMEN SAH & TERVERIFIKASI"** lengkap dengan nomor surat, instansi tujuan, nilai RAB, profil penandatangan resmi, dan jejak kriptografi SHA-256.

---

## 4. KEAMANAN & PRIVASI
* **Halaman Publik Bersih**: Halaman utama `dennyjcs.com/e-sign` tidak menampilkan daftar dokumen ke publik. Rincian dokumen hanya terbuka saat QR Code dipindai atau saat kode ID dokumen yang sah diketikkan.
* **Proteksi PIN Generator**: Hanya Anda pemegang PIN `1977` yang dapat mengakses menu generator dan menerbitkan tanda tangan digital baru.
