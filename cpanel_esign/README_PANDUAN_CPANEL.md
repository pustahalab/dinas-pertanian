# PANDUAN SISTEM E-SIGN & GENERATOR TANDA TANGAN DIGITAL
**Laman Resmi Verifikasi:** `dennyjcs.com/e-sign`  
**Panel Generator:** `dennyjcs.com/e-sign/generator.php`  
**Pemilik:** Ir. Denny Jean Cross Sihombing, S.T., M.T.  

---

## 1. SISTEM ID TANDA TANGAN (ID TTD) OTOMATIS & TERLACAK

Sesuai kebutuhan praktis, **Nomor Surat tidak lagi menjadi syarat wajib** karena tidak semua berkas memiliki nomor surat resmi (seperti proposal teknis, lampiran, dokumen kerja sama, atau sertifikasi).

Sebagai gantinya, sistem otomatis menerbitkan dan melacak **ID Tanda Tangan Digital (ID TTD)** unik:
* **Format ID TTD:** `DJCS-TTD-[TAHUN]-[NOMOR_URUT]` (Contoh: `DJCS-TTD-2026-004`)
* **Otomatis & Terlacak:** Sistem menghitung nomor urut dan mencatatnya ke basis data terenkripsi.
* **Tautan Verifikasi Langsung:** QR Code otomatis terhubung ke `https://dennyjcs.com/e-sign?doc=DJCS-TTD-2026-004`
* **Nomor Referensi Berkas:** Jika dokumen memiliki nomor surat, Anda tetap bisa mengisinya pada kolom opsional *(Nomor Surat/Berkas)*.

---

## 2. STRUKTUR BERKAS CPANEL (`public_html/e-sign/`)

Unggah 4 berkas dari folder `cpanel_esign/` ini ke folder `public_html/e-sign/` di cPanel hosting Anda:

```text
public_html/
└── e-sign/
    ├── .htaccess         <--- Perisai keamanan (blokir akses langsung ke berkas .json/.config)
    ├── index.php         <--- Portal Verifikasi Publik (saat QR Code dipindai mitra)
    ├── generator.php     <--- Panel Generator E-Sign & PDF Stamper (Akses PIN: 1977)
    └── documents.json    <--- Basis data arsip dokumen resmi (otomatis bertambah)
```

---

## 3. CARA MEMBUAT TANDA TANGAN DIGITAL BARU

1. **Buka Panel di Browser**:
   * Akses URL: `https://dennyjcs.com/e-sign/generator.php`
   * Masukkan **PIN Keamanan: `1977`**.

2. **Isi Formulir Dokumen**:
   * **ID TTD:** *Dibuat otomatis oleh sistem (contoh: `DJCS-TTD-2026-004`)*.
   * **Judul Dokumen / Proposal:** (contoh: *Proposal Sistem Informasi ...*)
   * **Nomor Surat:** *(Opsional — kosongkan jika tidak ada)*.
   * **Instansi Mitra / Tujuan:** (contoh: *Dinas Komunikasi dan Informatika*)
   * **Nilai Anggaran (RAB):** *(Opsional)*
   * **Durasi & Tanggal Dokumen**
   * Klik **"⚡ Daftarkan Dokumen & Buat E-Sign Sekarang"**.

3. **Pilihan Menempelkan ke Dokumen**:
   * **Pilihan A (Unduh Stempel PNG Transparan 300 DPI)**:
     Klik **"📥 Unduh Stempel TTD PNG"**, lalu masukkan gambar tersebut ke Microsoft Word, Google Docs, Canva, atau editor PDF pilihan Anda. Latar belakangnya 100% transparan dan rapi.
   * **Pilihan B (Tempel Langsung ke PDF di Browser)**:
     Buka tab **"📄 Tempel ke PDF"**, pilih file PDF Anda, pilih *Halaman Terakhir* dan posisi *Kanan Bawah*, lalu klik **"🚀 Tempelkan Stempel & Unduh PDF"**.

---

## 4. KEAMANAN TINGKAT TINGGI (ENTERPRISE-GRADE)
* **Proteksi Anti Brute-Force:** Maksimal 5 kali salah PIN, setelah itu IP penyerang otomatis diblokir 15 menit.
* **Enkripsi Bcrypt:** Sandi tersimpan dalam format hash kriptografi satu arah.
* **Proteksi Akses .htaccess:** Berkas `documents.json` tidak dapat diunduh langsung oleh pihak luar melalui browser.
* **Auto-Timeout:** Sesi generator otomatis keluar jika tidak aktif selama 30 menit.
* **Ubah PIN Mandiri:** Anda dapat mengganti PIN sewaktu-waktu di tab *"🛡️ Pengaturan PIN & Keamanan"*.
