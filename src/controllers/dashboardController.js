const pool = require('../config/db');

exports.index = async (req, res) => {
  try {
    const user = req.session.user;

    // 1. Jika role adalah Petani, tampilkan Portal Petani
    if (user.role === 'petani') {
      let petaniId = user.petani_id;
      if (!petaniId) {
        const [pRows] = await pool.query('SELECT id FROM petani LIMIT 1');
        petaniId = pRows.length > 0 ? pRows[0].id : null;
      }

      let farmerData = null;
      let aidList = [];
      let tripList = [];

      if (petaniId) {
        const [fRows] = await pool.query(
          `SELECT p.*, k.nama_kelompok, d.nama_distrik 
           FROM petani p 
           LEFT JOIN kelompok_tani k ON p.kelompok_tani_id = k.id 
           LEFT JOIN distrik d ON p.distrik = d.nama_distrik 
           WHERE p.id = ?`,
          [petaniId]
        );
        farmerData = fRows[0] || null;

        const [aRows] = await pool.query(
          `SELECT pb.nama_program, pb.jenis_bantuan, pb.tahun_anggaran, 
                  sb.volume_bantuan, sb.tanggal_penyaluran, sb.status_realisasi, sb.lokasi_penyaluran 
           FROM penyaluran_bantuan sb 
           JOIN program_bantuan pb ON sb.program_id = pb.id 
           WHERE sb.petani_id = ? 
           ORDER BY sb.tanggal_penyaluran DESC`,
          [petaniId]
        );
        aidList = aRows;

        const [tRows] = await pool.query(
          `SELECT * FROM transportasi_damri 
           WHERE petani_id = ? 
           ORDER BY tanggal_penggunaan DESC`,
          [petaniId]
        );
        tripList = tRows;
      }

      return res.render('dashboard/farmer_portal', {
        title: 'Portal Petani OAP - Kartu Tani Digital',
        farmer: farmerData,
        aids: aidList,
        trips: tripList
      });
    }

    // 2. Untuk Admin, Petugas, Pimpinan, dan DAMRI, siapkan statistik agregat
    const [[kpiData]] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM petani) as total_petani,
        (SELECT COUNT(*) FROM petani WHERE status_verifikasi = 'ditetapkan') as petani_ditetapkan,
        (SELECT COUNT(*) FROM petani WHERE status_verifikasi IN ('terverifikasi', 'diajukan')) as petani_pending,
        (SELECT COUNT(*) FROM kelompok_tani) as total_poktan,
        (SELECT COUNT(*) FROM program_bantuan WHERE status = 'aktif') as program_aktif,
        (SELECT COUNT(*) FROM penyaluran_bantuan WHERE status_realisasi = 'tersalurkan') as total_penyaluran,
        (SELECT COUNT(*) FROM transportasi_damri) as total_trip,
        (SELECT COALESCE(SUM(volume_kg), 0) FROM transportasi_damri) as total_kg_terangkut
    `);

    // Statistik petani per distrik
    const [districtStats] = await pool.query(`
      SELECT distrik, COUNT(*) as count 
      FROM petani 
      GROUP BY distrik 
      ORDER BY count DESC
    `);

    // Statistik komoditas utama
    const [commodityStats] = await pool.query(`
      SELECT komoditas_utama, COUNT(*) as count 
      FROM petani 
      GROUP BY komoditas_utama 
      ORDER BY count DESC 
      LIMIT 6
    `);

    // Aktivitas transportasi DAMRI terbaru
    const [recentTrips] = await pool.query(`
      SELECT td.*, p.nama_lengkap as nama_petani, p.nomor_kartu, p.distrik as distrik_petani, p.kampung as kampung_petani
      FROM transportasi_damri td
      JOIN petani p ON td.petani_id = p.id
      ORDER BY td.tanggal_penggunaan DESC
      LIMIT 7
    `);

    // Daftar verifikasi / penetapan yang perlu ditinjau
    const [pendingReview] = await pool.query(`
      SELECT id, nomor_kartu, nama_lengkap, distrik, kampung, komoditas_utama, status_verifikasi, created_at
      FROM petani
      WHERE status_verifikasi IN ('diajukan', 'terverifikasi')
      ORDER BY id DESC
      LIMIT 5
    `);

    res.render('dashboard/index', {
      title: 'Dashboard Manajemen - SIM-KARTANI Biak Numfor',
      kpi: kpiData,
      districts: districtStats,
      commodities: commodityStats,
      recentTrips,
      pendingReview
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Terjadi kesalahan memuat dashboard.');
  }
};
