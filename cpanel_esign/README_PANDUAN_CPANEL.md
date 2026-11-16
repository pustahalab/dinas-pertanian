# PANDUAN UPLOAD PORTAL VERIFIKASI TANDA TANGAN DIGITAL (E-SIGN)
**Website:** `dennyjcs.com/e-sign`  
**Pemilik:** Ir. Denny Jean Cross Sihombing, S.T., M.T.  

---

## 1. STRUKTUR FOLDER DI CPANEL

Untuk membuat URL `https://dennyjcs.com/e-sign` dapat diakses saat QR Code dipindai, Anda cukup mengunggah file `index.php` ke folder `e-sign` di dalam `public_html`.

Struktur direktori di File Manager cPanel Anda:
```text
public_html/
└── e-sign/
    ├── index.php    <--- (Upload berkas index.php dari folder cpanel_esign ini)
    └── .htaccess    <--- (Opsional, untuk keamanan & URL rewriting jika diperlukan)
```

---

## 2. LANGKAH-LANGKAH UPLOAD DI CPANEL

1. **Login ke cPanel Hosting**:
   * Buka browser dan akses alamat cPanel Anda (contoh: `https://dennyjcs.com:2083` atau melalui dashboard penyedia hosting Anda).
   * Masukkan *Username* dan *Password* cPanel Anda.

2. **Buka Menu File Manager**:
   * Pada dashboard cPanel, cari menu **"File Manager"** (Pengelola Berkas) pada kelompok menu *Files*.

3. **Masuk ke Direktori `public_html`**:
   * Klik ganda pada folder `public_html` (atau folder root domain utama `dennyjcs.com`).

4. **Buat Folder Baru Bernama `e-sign`**:
   * Klik tombol **"+ Folder"** di menu bagian atas.
   * Masukkan nama folder: `e-sign`
   * Klik **"Create New Folder"**.

5. **Upload File `index.php`**:
   * Masuk ke dalam folder `e-sign` yang baru saja dibuat (`public_html/e-sign`).
   * Klik tombol **"Upload"** di bilah menu atas.
   * Pilih dan unggah file `index.php` yang berada di folder proyek lokal Anda:  
     `d:\Project\dinas-pertanian\cpanel_esign\index.php`

6. **Selesai & Uji Coba**:
   * Buka browser Anda dan akses tautan pengujian:  
     👉 `https://dennyjcs.com/e-sign?doc=PROP-KARTANI-BIAK-2026`
   * Atau scan langsung QR Code yang ada di berkas PDF proposal menggunakan kamera smartphone Anda.

---

## 3. CARA MENAMBAH DOKUMEN BARU DI MASA DEPAN

Jika di kemudian hari Bapak menerbitkan proposal, surat keputusan, atau dokumen resmi lainnya, Bapak cukup membuka file `index.php` melalui fitur **"Edit"** di File Manager cPanel, lalu menambahkan data dokumen baru pada array `$registered_docs` (baris 17-55):

```php
$registered_docs = [
    // Dokumen Proposal Biak yang sudah ada
    'PROP-KARTANI-BIAK-2026' => [
        ...
    ],

    // Contoh Dokumen Baru yang ingin Bapak tambahkan:
    'DOC-KONTRAK-2027-001' => [
        'title'           => 'Surat Perjanjian Kerja Sama Swakelola Tipe II',
        'doc_number'      => '001/PKS-TI/DJCS/I/2027',
        'doc_type'        => 'Surat Perjanjian Kerja Sama (PKS)',
        'target_agency'   => 'Pemerintah Kabupaten Biak Numfor',
        'target_person'   => 'Bupati Biak Numfor',
        'signer_name'     => 'Ir. Denny Jean Cross Sihombing, S.T., M.T.',
        'signer_role'     => 'Pengembang Sistem Informasi & Dosen Sistem Informasi Unika Atma Jaya',
        'signer_email'    => 'denny.jean@atmajaya.ac.id',
        'issue_date'      => '15 Januari 2027',
        'issue_location'  => 'Jakarta / Biak',
        'budget_value'    => 'Rp 247.450.000,-',
        'duration'        => '4 Bulan',
        'hash_signature'  => 'SHA256: d4a7c1e5b8... (kode hash unik dokumen)',
        'status'          => 'VALID',
        'status_desc'     => 'Tanda tangan elektronik SAH dan TERVERIFIKASI resmi di dennyjcs.com'
    ]
];
```

---

## 4. KEUNGGULAN SCRIPT INI
1. **PHP Native Standalone**: Berjalan pada semua versi PHP cPanel (PHP 7.4, 8.0, 8.1, 8.2, 8.3) tanpa perlu menginstal framework atau dependensi komposer.
2. **Mobile-Responsive & Tampilan Elegan**: Menggunakan font modern *Plus Jakarta Sans*, desain kartu sertifikat validasi hijau bercentang (*Green Verified Badge*), serta tata letak responsif di ponsel pejabat/pemeriksa.
3. **Pencarian Fleksibel**: Menerima parameter URL langsung dari hasil scan QR Code (`?doc=...`) maupun penginputan manual nomor dokumen pada kolom pencarian.
