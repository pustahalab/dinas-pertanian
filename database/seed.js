const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const pool = require('../src/config/db');
const { hashPassword } = require('../src/utils/security');

async function seed() {
  console.log('🚀 Memulai proses seeding database SIM-KARTANI Biak Numfor...');

  const connection = await pool.getConnection();

  try {
    // 1. Eksekusi Schema
    console.log('📦 Menjalankan database schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('CREATE DATABASE') && !s.toUpperCase().startsWith('USE'));

    for (const stmt of statements) {
      await connection.query(stmt);
    }
    console.log('✅ Skema tabel berhasil diverifikasi/dibuat.');

    // Buat direktori upload jika belum ada
    const qrDir = path.join(__dirname, '..', 'public', 'uploads', 'qrcodes');
    fs.mkdirSync(qrDir, { recursive: true });

    // 2. Bersihkan tabel lama
    console.log('🧹 Membersihkan data lama untuk seeding baru...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE audit_log');
    await connection.query('TRUNCATE TABLE transportasi_damri');
    await connection.query('TRUNCATE TABLE penyaluran_bantuan');
    await connection.query('TRUNCATE TABLE program_bantuan');
    await connection.query('TRUNCATE TABLE petani');
    await connection.query('TRUNCATE TABLE kelompok_tani');
    await connection.query('TRUNCATE TABLE kampung');
    await connection.query('TRUNCATE TABLE distrik');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 3. Seed Users
    console.log('👤 Menambahkan akun pengguna (Multi-Role)...');
    const defaultPasswordHash = hashPassword('password123');
    const adminPasswordHash = hashPassword('admin123');
    const petugasPasswordHash = hashPassword('petugas123');
    const pimpinanPasswordHash = hashPassword('pimpinan123');
    const damriPasswordHash = hashPassword('damri123');
    const petaniPasswordHash = hashPassword('petani123');

    const usersData = [
      ['admin', adminPasswordHash, 'Administrator Dinas Pertanian', 'admin', '19850412 201001 1 008', 'Kepala Sub Bagian Umum & TI', '081234567801', null, 1],
      ['petugas', petugasPasswordHash, 'Petugas Lapangan & Verifikator', 'petugas', '19900823 201502 1 004', 'Penyuluh Pertanian Lapangan (PPL)', '081234567802', null, 1],
      ['pimpinan', pimpinanPasswordHash, 'drh. BAMBANG HAYANTO', 'pimpinan', '19720315 199803 1 006', 'Plt. Kepala Dinas Pertanian & Ketahanan Pangan', '081234567803', null, 1],
      ['damri', damriPasswordHash, 'Petugas Operasional DAMRI Biak', 'damri', 'DMR-BK-0092', 'Koordinator Transportasi Pemasaran Hasil Tani', '081234567804', null, 1],
      ['petani', petaniPasswordHash, 'OPICE ARWAM', 'petani', null, 'Petani Orang Asli Papua (OAP)', '081234567805', 1, 1]
    ];

    for (const u of usersData) {
      await connection.query(
        `INSERT INTO users (username, password, nama_lengkap, role, nip, jabatan, no_hp, petani_id, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        u
      );
    }
    console.log('✅ 5 Akun pengguna berhasil dibuat.');

    // 4. Load Data Petani dari JSON (hasil ekstrak Excel)
    const jsonPath = path.join(__dirname, 'farmers_data.json');
    const farmersList = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`📋 Membaca ${farmersList.length} data petani dari berkas resmi...`);

    // Kumpulkan distrik dan kampung unik
    const distrikMap = new Map();
    const kampungSet = new Set();

    farmersList.forEach(f => {
      distrikMap.set(f.distrik, (distrikMap.get(f.distrik) || 0) + 1);
      kampungSet.add(`${f.distrik}|${f.kampung}`);
    });

    // 5. Seed Distrik
    console.log('🗺️ Menambahkan data 10 Distrik di Biak Numfor...');
    let distrikDbIds = {};
    for (const [namaDistrik, count] of distrikMap.entries()) {
      const kode = 'BK-' + namaDistrik.substring(0, 3).toUpperCase();
      const [res] = await connection.query(
        `INSERT INTO distrik (nama_distrik, kode_distrik, jumlah_kampung) VALUES (?, ?, 0)`,
        [namaDistrik, kode]
      );
      distrikDbIds[namaDistrik] = res.insertId;
    }

    // 6. Seed Kampung
    console.log('🏡 Menambahkan data Kampung...');
    let kampungDbIds = {};
    for (const item of kampungSet) {
      const [distrikName, kampungName] = item.split('|');
      const distId = distrikDbIds[distrikName];
      const [res] = await connection.query(
        `INSERT INTO kampung (distrik_id, nama_kampung) VALUES (?, ?)`,
        [distId, kampungName]
      );
      kampungDbIds[item] = res.insertId;
    }

    // Update jumlah_kampung pada distrik
    for (const [namaDistrik, distId] of Object.entries(distrikDbIds)) {
      const [[{ count }]] = await connection.query(
        `SELECT COUNT(*) as count FROM kampung WHERE distrik_id = ?`,
        [distId]
      );
      await connection.query(`UPDATE distrik SET jumlah_kampung = ? WHERE id = ?`, [count, distId]);
    }

    // 7. Seed Kelompok Tani Representatif
    console.log('🌱 Menambahkan data Kelompok Tani Biak Numfor...');
    const poktanSamples = [
      ['KT-01', 'Kelompok Tani Mansinam Mandiri', 'Daniel Warwer', 'BIAK BARAT', 'DOUSI', 'Keladi & Ubi Jalar', 25, '081240112233'],
      ['KT-02', 'Kelompok Tani Saukobye Subur', 'Korneles Rumbrawer', 'BIAK UTARA', 'KOREM', 'Sayuran Lilin & Cabai', 30, '081240112234'],
      ['KT-03', 'Kelompok Tani Bosnik Sejahtera', 'Yohanis Wanma', 'BIAK TIMUR', 'BOSNIK', 'Keladi Biak & Jagung', 28, '081240112235'],
      ['KT-04', 'Kelompok Tani Warsa Jaya', 'Markus Arwam', 'WARSA', 'WARSA', 'Ubi Jalar & Singkong', 22, '081240112236'],
      ['KT-05', 'Kelompok Tani Samofa Hijau', 'Petrus Kmur', 'SAMOFA', 'SAMOFA', 'Hortikultura & Sayuran', 35, '081240112237'],
      ['KT-06', 'Kelompok Tani Yendidori Makmur', 'Zadrak Burako', 'YENDIDORI', 'PADWA', 'Keladi Biak & Pisang', 20, '081240112238'],
      ['KT-07', 'Kelompok Tani Andey Bersatu', 'Lukas Wanggober', 'ANDEY', 'ANDEY', 'Keladi & Tanaman Pangan', 18, '081240112239'],
      ['KT-08', 'Kelompok Tani Swandiwe Sejahtera', 'Abraham Makmaker', 'SWANDIWE', 'SWANDIWE', 'Ubi Jalar & Kacang Tanah', 24, '081240112240'],
      ['KT-09', 'Kelompok Tani Bondifuar Maju', 'Yulianus Abidondifu', 'BONDIFUAR', 'BONDIFUAR', 'Keladi & Singkong', 19, '081240112241'],
      ['KT-10', 'Kelompok Tani Oridek Barokah', 'Marthin Rumbruren', 'ORIDEK', 'ORIDEK', 'Sayuran Segar & Tomat', 26, '081240112242']
    ];

    const poktanDbIds = [];
    for (const p of poktanSamples) {
      const [res] = await connection.query(
        `INSERT INTO kelompok_tani (kode_kelompok, nama_kelompok, nama_ketua, distrik, kampung, komoditas_utama, jumlah_anggota, kontak_ketua)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        p
      );
      poktanDbIds.push(res.insertId);
    }

    // 8. Seed 500 Petani OAP
    console.log('🌾 Mengimpor 500 Data Petani OAP Penerima Kartu Tani...');
    const commodities = [
      'Keladi Biak',
      'Ubi Jalar (Petatas)',
      'Singkong (Kasbi)',
      'Sayuran Lilin & Sawi',
      'Jagung Manis',
      'Cabai Rawit',
      'Pisang Lokal',
      'Kacang Tanah'
    ];

    let insertedCount = 0;
    for (let i = 0; i < farmersList.length; i++) {
      const f = farmersList[i];
      const indexNum = i + 1;
      const formattedNum = String(indexNum).padStart(4, '0');
      const nomorKartu = `KT-OAP-2026-${formattedNum}`;
      const nik = `9106${String(10 + (indexNum % 80)).padStart(2, '0')}${String(1000000000 + indexNum * 317).slice(-10)}`;
      const komoditas = commodities[indexNum % commodities.length];
      const luasLahan = (0.25 + (indexNum % 8) * 0.25).toFixed(2);
      const estimasiPanen = (parseFloat(luasLahan) * 600 + (indexNum % 150)).toFixed(2);

      // Status berjenjang untuk mendemonstrasikan proses persetujuan:
      // Sebagian besar sudah ditetapkan penerima aktif kartu tani, sebagian masih terverifikasi atau diajukan
      let statusVerifikasi = 'ditetapkan';
      let statusKartu = 'aktif';
      let catatanVerifikasi = 'Lolos verifikasi faktual lapangan Otonomi Khusus.';
      let penetapId = 3; // Kepala Dinas
      let tglPenetapan = '2026-03-01 09:00:00';

      if (indexNum > 480) {
        statusVerifikasi = 'terverifikasi';
        statusKartu = 'nonaktif';
        catatanVerifikasi = 'Menunggu penetapan resmi oleh Kepala Dinas.';
        penetapId = null;
        tglPenetapan = null;
      } else if (indexNum > 470) {
        statusVerifikasi = 'diajukan';
        statusKartu = 'nonaktif';
        catatanVerifikasi = 'Data baru dimasukkan, menunggu verifikasi lapangan petugas.';
        penetapId = null;
        tglPenetapan = null;
      } else if (indexNum > 465) {
        statusVerifikasi = 'ditolak';
        statusKartu = 'nonaktif';
        catatanVerifikasi = 'Lahan tidak memenuhi kriteria penerima bantuan Otsus.';
        penetapId = 3;
        tglPenetapan = '2026-03-02 11:30:00';
      }

      const qrToken = `KTOAP-${formattedNum}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const poktanId = poktanDbIds[indexNum % poktanDbIds.length];

      // Generate QR Code data URL / file
      const qrPayload = JSON.stringify({
        nomor_kartu: nomorKartu,
        nama: f.nama,
        distrik: f.distrik,
        kampung: f.kampung,
        status: statusKartu === 'aktif' ? 'VALID' : 'NON-AKTIF',
        token: qrToken
      });

      const qrFilePath = path.join(qrDir, `${nomorKartu}.png`);
      // Simpan file QR untuk 50 pertama agar cepat, sisanya di-generate on-demand atau data url
      if (indexNum <= 50) {
        await QRCode.toFile(qrFilePath, qrPayload, {
          width: 300,
          margin: 2,
          color: { dark: '#1b4332', light: '#ffffff' }
        });
      }

      await connection.query(
        `INSERT INTO petani (
          nomor_kartu, nik, nama_lengkap, tempat_lahir, tanggal_lahir,
          jenis_kelamin, no_hp, alamat, distrik, kampung,
          kelompok_tani_id, status_oap, komoditas_utama, luas_lahan, estimasi_panen_kg,
          status_verifikasi, status_kartu, verifikator_id, tanggal_verifikasi, catatan_verifikasi,
          penetap_id, tanggal_penetapan, foto, qr_code_token
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nomorKartu,
          nik,
          f.nama,
          'Biak Numfor',
          `19${70 + (indexNum % 30)}-${String(1 + (indexNum % 12)).padStart(2, '0')}-${String(1 + (indexNum % 28)).padStart(2, '0')}`,
          indexNum % 3 === 0 ? 'P' : 'L',
          `081248${String(100000 + indexNum).slice(-6)}`,
          `Kampung ${f.kampung}, Distrik ${f.distrik}, Kab. Biak Numfor`,
          f.distrik,
          f.kampung,
          poktanId,
          'OAP',
          komoditas,
          luasLahan,
          estimasiPanen,
          statusVerifikasi,
          statusKartu,
          2, // Petugas ID
          '2026-02-15 10:00:00',
          catatanVerifikasi,
          penetapId,
          tglPenetapan,
          '/img/default-avatar.png',
          qrToken
        ]
      );
      insertedCount++;
    }
    console.log(`✅ ${insertedCount} Petani OAP berhasil disimpan ke database.`);

    // 9. Seed Program Bantuan Otsus
    console.log('🎁 Menambahkan Program Bantuan Otsus 2026...');
    const programs = [
      [
        'PRG-OTSUS-01',
        'Subsidi Transportasi Pemasaran Hasil Pangan DAMRI Otsus 2026',
        2026,
        'Otonomi Khusus (Otsus) Papua',
        'Subsidi Ongkos Angkut Hasil Pangan DAMRI',
        450000000.00,
        500,
        'Bantuan pembebasan biaya transportasi pengangkutan hasil pertanian dari sentra produksi (kampung-kampung) ke Pasar Tani Fandoi dan pasar distribusi Biak menggunakan armada DAMRI Perintis.',
        'Memiliki Kartu Tani OAP aktif, membawa hasil panen sendiri, rute yang telah ditentukan.',
        'aktif'
      ],
      [
        'PRG-OTSUS-02',
        'Bantuan Bibit Keladi Biak Unggul & Sayuran Lilin Otsus 2026',
        2026,
        'Otonomi Khusus (Otsus) Papua',
        'Bibit Unggul & Benih Bersertifikat',
        300000000.00,
        250,
        'Pemberian bibit keladi lokal unggul tahan hama dan benih sayuran bernilai ekonomi tinggi untuk mendongkrak ketahanan pangan OAP.',
        'Petani OAP terdaftar di Sim-Kartani, memiliki lahan garapan minimal 0.25 Ha.',
        'aktif'
      ],
      [
        'PRG-OTSUS-03',
        'Bantuan Pupuk Organik Granul & NPK Pertanian Otsus 2026',
        2026,
        'Otonomi Khusus (Otsus) Papua',
        'Pupuk Organik & Pembenah Tanah',
        250000000.00,
        300,
        'Penyaluran paket pupuk organik ramah lingkungan dan pupuk berimbang guna meningkatkan produktivitas lahan per hektar.',
        'Tergabung dalam Kelompok Tani aktif terdaftar.',
        'aktif'
      ],
      [
        'PRG-OTSUS-04',
        'Pengadaan Alat Mesin Pertanian (Alsintan) Hand Traktor & Cultivator Otsus 2026',
        2026,
        'Otonomi Khusus (Otsus) Papua',
        'Alsintan & Peralatan Modern',
        600000000.00,
        50,
        'Penyaluran unit hand traktor dan cultivator pengolah tanah serta handsprayer elektrik untuk efisiensi pengolahan lahan.',
        'Ditetapkan untuk kelompok tani OAP yang telah diverifikasi.',
        'aktif'
      ],
      [
        'PRG-OTSUS-05',
        'Bantuan Sarana Pasca Panen: Kotak Pengangkutan & Timbangan Digital Otsus 2026',
        2026,
        'Otonomi Khusus (Otsus) Papua',
        'Sarana Pasca Panen',
        150000000.00,
        200,
        'Fasilitasi wadah panen higienis dan timbangan gantung agar hasil komoditas tidak rusak saat diangkut DAMRI.',
        'Petani aktif memanfaatkan layanan transportasi DAMRI.',
        'aktif'
      ]
    ];

    const programDbIds = [];
    for (const p of programs) {
      const [res] = await connection.query(
        `INSERT INTO program_bantuan (kode_program, nama_program, tahun_anggaran, sumber_dana, jenis_bantuan, anggaran_total, kuota_penerima, deskripsi, syarat_ketentuan, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        p
      );
      programDbIds.push(res.insertId);
    }
    console.log('✅ 5 Program bantuan Otsus berhasil dibuat.');

    // 10. Seed Penyaluran Bantuan Nyata
    console.log('📦 Menambahkan riwayat penyaluran bantuan kepada petani...');
    const aidDisbursements = [
      [programDbIds[0], 1, 'Voucher Layanan Transportasi DAMRI (Bebas Biaya)', 500000, '2026-03-05', 'Kantor DAMRI Cabang Biak', 'Petugas Dinas', 'tersalurkan', 'Penggunaan rutin angkut keladi'],
      [programDbIds[1], 1, '50 Kg Bibit Keladi Unggul Biak', 750000, '2026-03-10', 'Balai Kampung Dousi', 'Petugas PPL Lapangan', 'tersalurkan', 'Kondisi bibit prima & siap tanam'],
      [programDbIds[2], 1, '2 Sak Pupuk Organik Granul (100 Kg)', 400000, '2026-03-12', 'Balai Kampung Dousi', 'Petugas PPL Lapangan', 'tersalurkan', 'Diterima lengkap'],
      [programDbIds[0], 2, 'Voucher Layanan Transportasi DAMRI (Bebas Biaya)', 500000, '2026-03-05', 'Kantor DAMRI Cabang Biak', 'Petugas Dinas', 'tersalurkan', 'Pengangkutan sayuran ke Pasar Fandoi'],
      [programDbIds[1], 2, '40 Kg Bibit Keladi Unggul Biak', 600000, '2026-03-10', 'Balai Kampung Dousi', 'Petugas PPL Lapangan', 'tersalurkan', 'Bibit keladi bersertifikat'],
      [programDbIds[0], 3, 'Voucher Layanan Transportasi DAMRI (Bebas Biaya)', 500000, '2026-03-06', 'Kantor DAMRI Cabang Biak', 'Petugas Dinas', 'tersalurkan', 'Pengangkutan singkong & pisang'],
      [programDbIds[3], 3, '1 Unit Handsprayer Elektrik 16L', 950000, '2026-03-15', 'Kantor Distrik Biak Barat', 'Petugas Alsintan', 'tersalurkan', 'Alat berfungsi baik'],
      [programDbIds[0], 4, 'Voucher Layanan Transportasi DAMRI (Bebas Biaya)', 500000, '2026-03-07', 'Kantor DAMRI Cabang Biak', 'Petugas Dinas', 'tersalurkan', 'Pengangkutan keladi & petatas'],
      [programDbIds[2], 4, '2 Sak Pupuk NPK Formula Khusus', 450000, '2026-03-14', 'Balai Kampung Dousi', 'Petugas PPL Lapangan', 'tersalurkan', 'Penyaluran tahap 1'],
      [programDbIds[0], 5, 'Voucher Layanan Transportasi DAMRI (Bebas Biaya)', 500000, '2026-03-08', 'Kantor DAMRI Cabang Biak', 'Petugas Dinas', 'tersalurkan', 'Pengangkutan jagung & sayur']
    ];

    // Tambah 40 penyaluran lain secara terdistribusi
    for (let j = 6; j <= 45; j++) {
      const prgId = programDbIds[j % programDbIds.length];
      aidDisbursements.push([
        prgId,
        j,
        'Paket Saprodi Pertanian Otsus (Bibit & Pupuk)',
        650000,
        `2026-03-${String(10 + (j % 18)).padStart(2, '0')}`,
        'Titik Distribusi Distrik',
        'Petugas Lapangan',
        'tersalurkan',
        'Realisasi bantuan Otsus Papua 2026'
      ]);
    }

    for (const a of aidDisbursements) {
      await connection.query(
        `INSERT INTO penyaluran_bantuan (program_id, petani_id, volume_bantuan, nilai_perkiraan, tanggal_penyaluran, lokasi_penyaluran, petugas_penyalur, status_realisasi, catatan)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        a
      );
    }
    console.log(`✅ ${aidDisbursements.length} Data penyaluran bantuan berhasil dicatat.`);

    // 11. Seed Transportasi DAMRI (Penggunaan Kartu Tani untuk Angkut Hasil Pangan)
    console.log('🚌 Menambahkan data operasional Transportasi DAMRI...');
    const destinationMarkets = [
      'Pasar Tani Fandoi Biak',
      'Pasar Darfuar Biak',
      'Pasar Bosnik Biak Timur',
      'Terminal Pasar Sentral Biak',
      'Pusat Distribusi Pangan Samofa'
    ];

    const damriTrips = [
      ['TRIP-202603-0001', 1, '2026-03-05 06:30:00', 'Kampung Dousi (Biak Barat)', destinationMarkets[0], 'Biak Barat - Pasar Tani Fandoi', 'Keladi Biak Super', 120.00, 3, 'Karung 40kg', 'DAMRI-BIAK-01', 'Bpk. Yance Rumakiek', 4, 'selesai', 'gratis_otsus', 'Kartu Tani terverifikasi QR Code. Hasil tani langsung masuk lapak pasar.'],
      ['TRIP-202603-0002', 2, '2026-03-05 06:45:00', 'Kampung Dousi (Biak Barat)', destinationMarkets[0], 'Biak Barat - Pasar Tani Fandoi', 'Sayuran Lilin & Sawi', 65.00, 4, 'Keranjang Bambu', 'DAMRI-BIAK-01', 'Bpk. Yance Rumakiek', 4, 'selesai', 'gratis_otsus', 'Sayuran segar pagi hari sampai tepat waktu di pasar.'],
      ['TRIP-202603-0003', 3, '2026-03-06 07:00:00', 'Kampung Dousi (Biak Barat)', destinationMarkets[1], 'Biak Barat - Pasar Darfuar', 'Ubi Jalar & Singkong', 150.00, 3, 'Karung 50kg', 'DAMRI-BIAK-02', 'Bpk. Markus Mandowen', 4, 'selesai', 'gratis_otsus', 'Muatan penuh, kondisi komoditas baik.'],
      ['TRIP-202603-0004', 11, '2026-03-06 07:15:00', 'Kampung Sosmai (Biak Barat)', destinationMarkets[0], 'Biak Barat - Pasar Tani Fandoi', 'Keladi Biak & Pisang', 95.00, 2, 'Karung Goni', 'DAMRI-BIAK-01', 'Bpk. Yance Rumakiek', 4, 'selesai', 'gratis_otsus', 'Verifikasi QR berhasil.'],
      ['TRIP-202603-0005', 25, '2026-03-07 06:20:00', 'Kampung Korem (Biak Utara)', destinationMarkets[0], 'Biak Utara - Pasar Tani Fandoi', 'Cabai Rawit & Tomat', 45.00, 3, 'Peti Kayu', 'DAMRI-BIAK-03', 'Bpk. Frans Rumaropen', 4, 'selesai', 'gratis_otsus', 'Pengangkutan komoditas hortikultura.'],
      ['TRIP-202603-0006', 40, '2026-03-08 06:50:00', 'Kampung Warsa (Warsa)', destinationMarkets[3], 'Warsa - Terminal Sentral Biak', 'Ubi Jalar & Jagung Manis', 180.00, 4, 'Karung 45kg', 'DAMRI-BIAK-02', 'Bpk. Markus Mandowen', 4, 'selesai', 'gratis_otsus', 'Perjalanan lancar tanpa kendala.'],
      ['TRIP-202603-0007', 1, '2026-03-12 06:30:00', 'Kampung Dousi (Biak Barat)', destinationMarkets[0], 'Biak Barat - Pasar Tani Fandoi', 'Keladi Biak Unggul', 140.00, 3, 'Karung 45kg plus noken', 'DAMRI-BIAK-01', 'Bpk. Yance Rumakiek', 4, 'selesai', 'gratis_otsus', 'Trip rutin mingguan petani Opice Arwam.'],
      ['TRIP-202603-0008', 55, '2026-03-14 07:10:00', 'Kampung Padwa (Yendidori)', destinationMarkets[1], 'Yendidori - Pasar Darfuar', 'Pisang Lokal & Keladi', 85.00, 2, 'Ikat Noken Tradisional', 'DAMRI-BIAK-01', 'Bpk. Yance Rumakiek', 4, 'selesai', 'gratis_otsus', 'Angkutan lancar.'],
      ['TRIP-202603-0009', 70, '2026-03-16 06:40:00', 'Kampung Bosnik (Biak Timur)', destinationMarkets[2], 'Biak Timur - Pasar Bosnik', 'Sayuran Segar & Kacang Tanah', 60.00, 3, 'Keranjang', 'DAMRI-BIAK-03', 'Bpk. Frans Rumaropen', 4, 'selesai', 'gratis_otsus', 'Penjualan ke pasar lokal Bosnik.'],
      ['TRIP-202603-0010', 1, '2026-03-19 06:30:00', 'Kampung Dousi (Biak Barat)', destinationMarkets[0], 'Biak Barat - Pasar Tani Fandoi', 'Keladi Biak & Sayuran Lilin', 110.00, 3, 'Karung', 'DAMRI-BIAK-01', 'Bpk. Yance Rumakiek', 4, 'selesai', 'gratis_otsus', 'Layanan angkut gratis Otsus dimanfaatkan penuh.']
    ];

    // Tambahkan 25 perjalanan acak lainnya untuk memperkaya statistik dashboard
    for (let k = 11; k <= 35; k++) {
      const pId = 1 + (k * 7) % 400;
      const tgl = `2026-03-${String(1 + (k % 28)).padStart(2, '0')} 0${6 + (k % 3)}:${String(10 + (k * 2) % 45).padStart(2, '0')}:00`;
      const pasar = destinationMarkets[k % destinationMarkets.length];
      const kom = commodities[k % commodities.length];
      const kg = (40 + (k * 5) % 180).toFixed(2);
      const tripCode = `TRIP-202603-${String(k).padStart(4, '0')}`;

      damriTrips.push([
        tripCode,
        pId,
        tgl,
        `Titik Kumpul Halte Distrik ${(k % 10) + 1}`,
        pasar,
        `Distrik ${(k % 10) + 1} - ${pasar}`,
        kom,
        kg,
        2 + (k % 3),
        'Karung Petani',
        `DAMRI-BIAK-0${1 + (k % 3)}`,
        'Petugas Lapangan DAMRI',
        4,
        'selesai',
        'gratis_otsus',
        'Verifikasi QR Berhasil melalui Scanner DAMRI.'
      ]);
    }

    for (const t of damriTrips) {
      await connection.query(
        `INSERT INTO transportasi_damri (
          kode_perjalanan, petani_id, tanggal_penggunaan, titik_keberangkatan, titik_tujuan,
          rute, komoditas, volume_kg, jumlah_kemasan, jenis_kemasan,
          nomor_armada, nama_driver, petugas_damri_id, status_perjalanan, status_subsidi, catatan_operasional
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        t
      );
    }
    console.log(`✅ ${damriTrips.length} Catatan perjalanan transportasi DAMRI berhasil dibuat.`);

    // 12. Seed Audit Log
    console.log('📝 Menambahkan log audit sistem...');
    const logs = [
      [1, 'LOGIN', 'users', 1, 'Pengguna admin berhasil masuk ke dalam sistem', '127.0.0.1'],
      [1, 'IMPORT_DATA', 'petani', null, 'Import 500 data petani penerima Kartu Tani OAP dari berkas Excel Kabupaten Biak Numfor', '127.0.0.1'],
      [2, 'VERIFIKASI_PETANI', 'petani', 1, 'Verifikasi data petani Opice Arwam status VALID', '127.0.0.1'],
      [3, 'PENETAPAN_PENERIMA', 'petani', 1, 'Kepala Dinas menetapkan Opice Arwam sebagai Penerima Kartu Tani OAP Aktif', '127.0.0.1'],
      [4, 'SCAN_QR_VALIDASI', 'transportasi_damri', 1, 'Petugas DAMRI memindai QR Code KT-OAP-2026-0001 (Valid: Diizinkan angkut hasil panen)', '127.0.0.1'],
      [4, 'CATAT_PENGANGKUTAN', 'transportasi_damri', 1, 'Pencatatan angkutan hasil panen 120 Kg Keladi Biak rute Biak Barat - Pasar Tani Fandoi', '127.0.0.1']
    ];

    for (const l of logs) {
      await connection.query(
        `INSERT INTO audit_log (user_id, action, entity, entity_id, details, ip_address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        l
      );
    }

    console.log('🎉 PROSES SEEDING SELESAI DENGAN SUKSES!');
    console.log('---------------------------------------------------------');
    console.log('AKUN PENGGUNA UNTUK DEMO & PENGUJIAN:');
    console.log('1. Admin Dinas     : admin     / admin123');
    console.log('2. Petugas PPL     : petugas   / petugas123');
    console.log('3. Kepala Dinas    : pimpinan  / pimpinan123');
    console.log('4. Petugas DAMRI   : damri     / damri123');
    console.log('5. Petani OAP      : petani    / petani123');
    console.log('---------------------------------------------------------');

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat seeding:', error);
    throw error;
  } finally {
    connection.release();
    process.exit(0);
  }
}

seed();
