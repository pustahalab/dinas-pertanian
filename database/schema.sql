-- =========================================================================
-- DATABASE SCHEMA: SIM-KARTANI BIAK NUMFOR
-- Sistem Informasi Manajemen Kartu Tani OAP & Transportasi Pemasaran Hasil Pertanian
-- Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `dinas_pertanian_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dinas_pertanian_db`;

-- 1. Tabel Pengguna (Users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nama_lengkap` VARCHAR(120) NOT NULL,
  `role` ENUM('admin', 'petugas', 'pimpinan', 'damri', 'petani') NOT NULL DEFAULT 'petani',
  `nip` VARCHAR(50) NULL,
  `jabatan` VARCHAR(100) NULL,
  `no_hp` VARCHAR(25) NULL,
  `petani_id` INT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_petani_id` (`petani_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Distrik (10 Distrik di Biak Numfor)
CREATE TABLE IF NOT EXISTS `distrik` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_distrik` VARCHAR(100) NOT NULL UNIQUE,
  `kode_distrik` VARCHAR(20) NULL,
  `jumlah_kampung` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Kampung
CREATE TABLE IF NOT EXISTS `kampung` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `distrik_id` INT NOT NULL,
  `nama_kampung` VARCHAR(100) NOT NULL,
  `kode_pos` VARCHAR(10) DEFAULT '98111',
  INDEX `idx_kampung_distrik` (`distrik_id`),
  FOREIGN KEY (`distrik_id`) REFERENCES `distrik`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Kelompok Tani
CREATE TABLE IF NOT EXISTS `kelompok_tani` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_kelompok` VARCHAR(50) NOT NULL UNIQUE,
  `nama_kelompok` VARCHAR(150) NOT NULL,
  `nama_ketua` VARCHAR(120) NOT NULL,
  `distrik` VARCHAR(100) NOT NULL,
  `kampung` VARCHAR(100) NOT NULL,
  `komoditas_utama` VARCHAR(100) NOT NULL DEFAULT 'Keladi & Sayuran',
  `jumlah_anggota` INT DEFAULT 0,
  `status_keaktifan` ENUM('aktif', 'tidak_aktif') DEFAULT 'aktif',
  `tahun_berdiri` INT DEFAULT 2020,
  `kontak_ketua` VARCHAR(25) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_poktan_distrik` (`distrik`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Petani OAP
CREATE TABLE IF NOT EXISTS `petani` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nomor_kartu` VARCHAR(50) NOT NULL UNIQUE,
  `nik` VARCHAR(25) NOT NULL UNIQUE,
  `nama_lengkap` VARCHAR(150) NOT NULL,
  `tempat_lahir` VARCHAR(100) DEFAULT 'Biak',
  `tanggal_lahir` DATE NULL,
  `jenis_kelamin` ENUM('L', 'P') DEFAULT 'L',
  `no_hp` VARCHAR(25) NULL,
  `alamat` TEXT NULL,
  `distrik` VARCHAR(100) NOT NULL,
  `kampung` VARCHAR(100) NOT NULL,
  `kelompok_tani_id` INT NULL,
  `status_oap` ENUM('OAP', 'Non-OAP') NOT NULL DEFAULT 'OAP',
  `komoditas_utama` VARCHAR(100) DEFAULT 'Keladi Biak',
  `luas_lahan` DECIMAL(5,2) DEFAULT 0.50,
  `estimasi_panen_kg` DECIMAL(8,2) DEFAULT 350.00,
  `status_verifikasi` ENUM('draft', 'diajukan', 'terverifikasi', 'ditetapkan', 'ditolak') NOT NULL DEFAULT 'ditetapkan',
  `status_kartu` ENUM('aktif', 'nonaktif', 'ditangguhkan') NOT NULL DEFAULT 'aktif',
  `verifikator_id` INT NULL,
  `tanggal_verifikasi` DATETIME NULL,
  `catatan_verifikasi` TEXT NULL,
  `penetap_id` INT NULL,
  `tanggal_penetapan` DATETIME NULL,
  `foto` VARCHAR(255) DEFAULT '/img/default-avatar.png',
  `qr_code_token` VARCHAR(100) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_petani_nomor_kartu` (`nomor_kartu`),
  INDEX `idx_petani_nik` (`nik`),
  INDEX `idx_petani_distrik` (`distrik`),
  INDEX `idx_petani_status_verifikasi` (`status_verifikasi`),
  INDEX `idx_petani_status_kartu` (`status_kartu`),
  FOREIGN KEY (`kelompok_tani_id`) REFERENCES `kelompok_tani`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Program Bantuan Otsus
CREATE TABLE IF NOT EXISTS `program_bantuan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_program` VARCHAR(50) NOT NULL UNIQUE,
  `nama_program` VARCHAR(180) NOT NULL,
  `tahun_anggaran` INT NOT NULL DEFAULT 2026,
  `sumber_dana` VARCHAR(120) NOT NULL DEFAULT 'Otonomi Khusus (Otsus) Papua',
  `jenis_bantuan` VARCHAR(120) NOT NULL,
  `anggaran_total` DECIMAL(15,2) DEFAULT 500000000.00,
  `kuota_penerima` INT DEFAULT 150,
  `deskripsi` TEXT NULL,
  `syarat_ketentuan` TEXT NULL,
  `status` ENUM('aktif', 'selesai', 'draf') NOT NULL DEFAULT 'aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Penyaluran Bantuan ke Petani
CREATE TABLE IF NOT EXISTS `penyaluran_bantuan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `program_id` INT NOT NULL,
  `petani_id` INT NOT NULL,
  `volume_bantuan` VARCHAR(120) NOT NULL,
  `nilai_perkiraan` DECIMAL(12,2) DEFAULT 0.00,
  `tanggal_penyaluran` DATE NOT NULL,
  `lokasi_penyaluran` VARCHAR(150) NOT NULL DEFAULT 'Kantor Distrik Biak',
  `petugas_penyalur` VARCHAR(100) NOT NULL,
  `status_realisasi` ENUM('tersalurkan', 'diproses', 'dibatalkan') NOT NULL DEFAULT 'tersalurkan',
  `dokumentasi` VARCHAR(255) NULL,
  `catatan` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_salur_program` (`program_id`),
  INDEX `idx_salur_petani` (`petani_id`),
  FOREIGN KEY (`program_id`) REFERENCES `program_bantuan`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`petani_id`) REFERENCES `petani`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabel Transportasi DAMRI (Pemasaran Hasil Pertanian)
CREATE TABLE IF NOT EXISTS `transportasi_damri` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_perjalanan` VARCHAR(50) NOT NULL UNIQUE,
  `petani_id` INT NOT NULL,
  `tanggal_penggunaan` DATETIME NOT NULL,
  `titik_keberangkatan` VARCHAR(150) NOT NULL,
  `titik_tujuan` VARCHAR(150) NOT NULL DEFAULT 'Pasar Tani Fandoi Biak',
  `rute` VARCHAR(150) NOT NULL,
  `komoditas` VARCHAR(120) NOT NULL,
  `volume_kg` DECIMAL(8,2) NOT NULL,
  `jumlah_kemasan` INT DEFAULT 1,
  `jenis_kemasan` VARCHAR(50) DEFAULT 'Karung / Noken',
  `nomor_armada` VARCHAR(50) NOT NULL DEFAULT 'DAMRI-BIAK-01',
  `nama_driver` VARCHAR(100) NOT NULL DEFAULT 'Supir DAMRI Perintis',
  `petugas_damri_id` INT NULL,
  `status_perjalanan` ENUM('selesai', 'sedang_berjalan', 'dibatalkan') NOT NULL DEFAULT 'selesai',
  `status_subsidi` ENUM('gratis_otsus', 'berbayar') NOT NULL DEFAULT 'gratis_otsus',
  `catatan_operasional` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_damri_petani` (`petani_id`),
  INDEX `idx_damri_tanggal` (`tanggal_penggunaan`),
  INDEX `idx_damri_komoditas` (`komoditas`),
  FOREIGN KEY (`petani_id`) REFERENCES `petani`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabel Audit Log & Aktivitas
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity` VARCHAR(50) NOT NULL,
  `entity_id` INT NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_user` (`user_id`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
