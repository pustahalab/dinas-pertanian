# Arsitektur Sistem SIM-KARTANI Biak Numfor

## 1. Gambaran Umum Sistem
**SIM-KARTANI BIAK NUMFOR** (Sistem Informasi Manajemen Kartu Tani OAP & Layanan Transportasi DAMRI) dirancang untuk menyelesaikan dua permasalahan fundamental pada **Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor**, yaitu:
1. **Tata Kelola Pendataan Petani & Bantuan Otonomi Khusus (Otsus)**: Menggantikan pengelolaan berkas manual (Word & Excel) menjadi basis data terintegrasi berjenjang (Pendataan &rarr; Verifikasi Lapangan &rarr; Penetapan Kepala Dinas &rarr; Penerbitan Kartu Tani OAP).
2. **Akses Pemasaran Hasil Pangan & Integrasi Transportasi DAMRI**: Memfasilitasi petani Orang Asli Papua (OAP) membawa komoditas pascapanen (Keladi, Petatas, Kasbi, Sayuran) menuju pasar distribusi (Pasar Tani Fandoi, Pasar Darfuar, Pasar Bosnik) dengan validasi QR Code Kartu Tani digital secara realtime.

---

## 2. Aktor & Matriks Hak Akses (RBAC)

| Peran (Role) | Tanggung Jawab & Fitur Utama |
|---|---|
| **Admin Dinas** | Manajemen seluruh master data (petani, kelompok tani, distrik/kampung), manajemen pengguna, hak akses, audit log, dan ekspor laporan. |
| **Petugas Lapangan (PPL / Verifikator)** | Pendaftaran calon petani OAP, verifikasi faktual lapangan, upload catatan kondisi lahan, pencatatan penyaluran bantuan Otsus. |
| **Pimpinan (Kepala Dinas / Kabid)** | Menetapkan status penerima bantuan Otsus secara resmi (`DITETAPKAN` / `DITOLAK`), mengaktifkan Kartu Tani digital, monitoring executive dashboard & laporan. |
| **Petugas DAMRI (Operator / Driver)** | Pemindaian QR Code Kartu Tani di halte/titik kumpul, validasi keaktifan kartu, pencatatan manifest angkutan (asal, tujuan pasar, komoditas, berat dalam Kg, armada). |
| **Petani OAP (Penerima Manfaat)** | Mengakses portal petani digital mandiri, menampilkan Kartu Tani OAP & QR Code, mengecek riwayat bantuan yang diterima, dan riwayat perjalanan angkutan DAMRI. |

---

## 3. Alur Kerja Sistem (Workflow Architecture)

### A. Alur Administrasi & Penerbitan Kartu Tani
```mermaid
flowchart TD
    A([Mulai]) --> B[Petugas / Admin Input Data Petani]
    B --> C[Verifikasi Faktual Lapangan oleh Petugas PPL]
    C --> D{Data Valid?}
    D -- Tidak --> E[Status: Ditolak / Perbaikan Data]
    D -- Ya --> F[Status: Terverifikasi]
    F --> G[Kepala Dinas Meninjau & Menetapkan Penerima]
    G --> H{Disetujui Pimpinan?}
    H -- Tidak --> E
    H -- Ya --> I[Status: DITETAPKAN & Kartu Tani Aktif]
    I --> J[Generate QR Code Unik Berbasis Token]
    J --> K[Penerbitan Kartu Tani Digital / Cetak Fisik]
    K --> L([Selesai])
```

### B. Alur Penggunaan Kartu Tani untuk Transportasi DAMRI
```mermaid
sequenceDiagram
    autonumber
    actor Petani as Petani OAP
    actor Damri as Petugas DAMRI
    participant App as Sistem SIM-KARTANI
    participant DB as Basis Data MySQL

    Petani->>Damri: Menunjukkan Kartu Tani Digital / Fisik (QR Code)
    Damri->>App: Memindai QR Code via Scanner / Input Nomor Kartu
    App->>DB: Query nomor kartu & status keaktifan
    DB-->>App: Data Petani & Status (AKTIF / NON-AKTIF)
    alt Kartu Aktif & Ditetapkan (VALID)
        App-->>Damri: Tampilkan Profil Petani (Foto, Kampung, Komoditas) - Status VALID
        Damri->>Petani: Layani Pengangkutan Hasil Panen
        Damri->>App: Input Manifest (Pasar Tujuan, Komoditas, Berat Kg, Armada)
        App->>DB: Simpan Catatan Transportasi & Audit Trail
        App-->>Damri: Konfirmasi Perjalanan Berhasil Dicatat (Kode TRIP)
    else Kartu Tidak Aktif / Belum Ditetapkan (INVALID)
        App-->>Damri: Peringatan Akses Ditolak (Alasan Status Penolakan)
        Damri->>Petani: Akses Angkutan Bebas Biaya Ditolak
    end
```

---

## 4. Struktur Arsitektur Teknologi

- **Runtime**: Node.js v22 LTS (Express.js Framework)
- **Database**: MySQL Server (Database relational dengan ACID compliance & Foreign Key integrity)
- **View Engine**: EJS-compatible template engine dengan modular partials
- **Keamanan (Security)**:
  - Password hashing berbasis `scrypt` kriptografis dengan salt acak 128-bit
  - Sesi berbasis Cookie bertanda tangan (HMAC-SHA256 signature)
  - Proteksi XSS (Contextual HTML Escaping)
  - Proteksi IDOR & RBAC Middleware
  - Audit Trail Logging untuk setiap aksi kritis (Input, Verifikasi, Penetapan, Scan)
- **Library Integrasi**:
  - `qrcode`: Generator barcode QR 2D resolusi tinggi
  - `html5-qrcode`: Pemindai kamera QR real-time multi-platform (HP / Tablet / Laptop)
  - `Chart.js`: Visualisasi grafik sebaran distrik & komoditas
