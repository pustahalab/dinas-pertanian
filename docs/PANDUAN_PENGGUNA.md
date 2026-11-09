# Panduan Pengguna (User Manual)

## 1. Akses dan Akun Uji Coba (Demo Accounts)

Untuk mempermudah dosen penguji, penilai, dan pengguna dalam mengeksplorasi seluruh fitur sistem, disediakan fitur **1-Click Quick Demo Login** pada halaman masuk (`/login`), atau dapat menggunakan kredensial berikut:

| Peran | Nama Pengguna | Kata Sandi | Deskripsi Pengujian |
|---|---|---|---|
| **Admin Dinas** | `admin` | `admin123` | Akses penuh master data, manajemen petani, cetak batch, ekspor laporan. |
| **Petugas Lapangan** | `petugas` | `petugas123` | Uji coba verifikasi lapangan data petani dan pencatatan serah terima bantuan. |
| **Kepala Dinas** | `pimpinan` | `pimpinan123` | Uji coba penetapan status bantuan (`ditetapkan`), otorisasi penerbitan kartu tani. |
| **Petugas DAMRI** | `damri` | `damri123` | Uji coba pemindaian QR Code kamera, validasi keaktifan kartu, dan pencatatan muatan hasil panen. |
| **Petani OAP** | `petani` | `petani123` | Uji coba portal petani, melihat kartu tani digital dengan QR code mandiri. |

---

## 2. Panduan Skenario Operasional

### A. Verifikasi & Penetapan Petani
1. Masuk sebagai **Petugas** (`petugas`).
2. Buka menu **Data Petani OAP** &rarr; cari petani yang berstatus **Diajukan** (misal ID 471).
3. Buka halaman detail &rarr; pada kotak **Tahap 1: Verifikasi Lapangan Petugas**, masukkan catatan lapangan &rarr; klik **Verifikasi Data Valid**. Status berubah menjadi `TERVERIFIKASI`.
4. Beralih peran ke **Pimpinan** (`pimpinan`).
5. Buka kembali petani tersebut &rarr; pada kotak **Tahap 2: Penetapan Penerima (Kepala Dinas)**, masukkan disposisi &rarr; klik **Tetapkan & Terbitkan Kartu Tani**. Status kartu otomatis berubah menjadi `AKTIF`.

### B. Simulasi Angkutan DAMRI Menggunakan QR Code
1. Masuk sebagai **Petugas DAMRI** (`damri`).
2. Buka menu **Scan QR Kartu Tani** (`/transport/scanner`).
3. Jika menggunakan kamera HP/Laptop, arahkan ke QR Code pada kartu petani.
4. Jika tidak menggunakan kamera, gunakan fitur **Verifikasi Manual** atau klik tombol uji coba (misal: `KT-OAP-2026-0001`).
5. Muncul popup status kartu:
   - **KARTU VALID (Hijau)**: Tombol *Layani & Catat Angkutan DAMRI* aktif.
   - **AKSES DITOLAK (Merah)**: Jika mencoba kartu yang ditolak / non-aktif (misal: `KT-OAP-2026-0466`).
6. Klik **Layani & Catat Angkutan DAMRI** &rarr; isi form muatan komoditas (misal 100 Kg Keladi ke Pasar Tani Fandoi) &rarr; klik **Simpan Catatan Angkutan DAMRI**.
7. Data langsung tercatat dan dapat dilihat pada **Riwayat Angkutan DAMRI** serta **Dashboard Utama**.

### C. Cetak Kartu Tani OAP
1. Masuk sebagai **Admin** atau **Petugas**.
2. Masuk ke menu **Cetak Kartu Tani** (`/cards/print-batch`).
3. Pilih distrik yang diinginkan dan klik **Cetak Lembar (Print)** untuk mencetak lembar kartu siap potong.
4. Untuk mencetak kartu satuan, buka detail petani &rarr; klik **Cetak Kartu Tani**.
