const pool = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

exports.scanner = async (req, res) => {
  res.render('transport/scanner', {
    title: 'Scanner QR Code Kartu Tani - Layanan Transportasi DAMRI'
  });
};

exports.recordForm = async (req, res) => {
  try {
    const { card, token, petani_id } = req.query;

    let farmer = null;
    if (petani_id) {
      const [rows] = await pool.query('SELECT * FROM petani WHERE id = ?', [petani_id]);
      farmer = rows[0] || null;
    } else if (card) {
      const [rows] = await pool.query('SELECT * FROM petani WHERE nomor_kartu = ?', [card]);
      farmer = rows[0] || null;
    } else if (token) {
      const [rows] = await pool.query('SELECT * FROM petani WHERE qr_code_token = ?', [token]);
      farmer = rows[0] || null;
    }

    if (!farmer) {
      req.flash('error', 'Petani tidak ditemukan. Silakan scan QR Code kembali.');
      return res.redirect('/transport/scanner');
    }

    // Periksa keaktifan kartu
    if (farmer.status_kartu !== 'aktif' || farmer.status_verifikasi !== 'ditetapkan') {
      req.flash('error', `AKSES DITOLAK: Kartu Tani [${farmer.nomor_kartu}] milik [${farmer.nama_lengkap}] berstatus ${farmer.status_kartu.toUpperCase()} (${farmer.status_verifikasi.toUpperCase()}). Tidak memenuhi syarat angkutan gratis Otsus.`);
      return res.redirect('/transport/scanner');
    }

    // Default pasar tujuan
    const destinationMarkets = [
      'Pasar Tani Fandoi Biak',
      'Pasar Darfuar Biak',
      'Pasar Bosnik Biak Timur',
      'Terminal Pasar Sentral Biak',
      'Pusat Distribusi Pangan Samofa'
    ];

    res.render('transport/record', {
      title: 'Pencatatan Angkutan Hasil Tani - DAMRI Biak',
      farmer,
      destinationMarkets
    });
  } catch (err) {
    console.error('Transport record form error:', err);
    res.status(500).send('Terjadi kesalahan membuka form pencatatan DAMRI.');
  }
};

exports.saveRecord = async (req, res) => {
  try {
    const {
      petani_id, titik_keberangkatan, titik_tujuan, rute,
      komoditas, volume_kg, jumlah_kemasan, jenis_kemasan,
      nomor_armada, nama_driver, status_perjalanan, catatan_operasional
    } = req.body;

    // Pastikan petani aktif
    const [pRows] = await pool.query('SELECT * FROM petani WHERE id = ?', [petani_id]);
    if (pRows.length === 0) {
      req.flash('error', 'Petani tidak ditemukan.');
      return res.redirect('/transport/scanner');
    }
    const farmer = pRows[0];

    if (farmer.status_kartu !== 'aktif') {
      req.flash('error', 'Kartu Tani tidak aktif. Layanan ditolak.');
      return res.redirect('/transport/scanner');
    }

    // Generate kode perjalanan unik
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const [[{ maxTrip }]] = await pool.query('SELECT COALESCE(MAX(id), 0) + 1 as maxTrip FROM transportasi_damri');
    const kodePerjalanan = `TRIP-${dateStr}-${String(maxTrip).padStart(4, '0')}`;

    const petugasDamriId = req.session.user?.id || null;

    await pool.query(
      `INSERT INTO transportasi_damri (
        kode_perjalanan, petani_id, tanggal_penggunaan, titik_keberangkatan, titik_tujuan,
        rute, komoditas, volume_kg, jumlah_kemasan, jenis_kemasan,
        nomor_armada, nama_driver, petugas_damri_id, status_perjalanan, status_subsidi, catatan_operasional
      ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'gratis_otsus', ?)`,
      [
        kodePerjalanan,
        petani_id,
        titik_keberangkatan,
        titik_tujuan,
        rute || `${titik_keberangkatan} - ${titik_tujuan}`,
        komoditas,
        parseFloat(volume_kg) || 50.00,
        parseInt(jumlah_kemasan, 10) || 1,
        jenis_kemasan || 'Karung',
        nomor_armada || 'DAMRI-BIAK-01',
        nama_driver || 'Supir DAMRI',
        petugasDamriId,
        status_perjalanan || 'selesai',
        catatan_operasional || 'Pengangkutan hasil pertanian binaan Otsus Papua.'
      ]
    );

    await logAudit(
      req,
      'CATAT_TRANSPORTASI_DAMRI',
      'transportasi_damri',
      null,
      `Pencatatan angkutan hasil tani [${kodePerjalanan}]: ${farmer.nama_lengkap} (${komoditas} ${volume_kg} Kg) -> ${titik_tujuan}`
    );

    req.flash('success', `Perjalanan DAMRI [${kodePerjalanan}] berhasil dicatat! Hasil panen [${komoditas}] (${volume_kg} Kg) milik [${farmer.nama_lengkap}] terdaftar.`);
    return res.redirect('/transport/history');
  } catch (err) {
    console.error('Transport save error:', err);
    req.flash('error', `Gagal menyimpan catatan transportasi: ${err.message}`);
    return res.redirect('/transport/scanner');
  }
};

exports.history = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '15', 10);
    const offset = (page - 1) * limit;

    const { search, pasar } = req.query;

    let whereClauses = [];
    let params = [];

    if (search && search.trim()) {
      whereClauses.push('(p.nama_lengkap LIKE ? OR p.nomor_kartu LIKE ? OR td.kode_perjalanan LIKE ? OR td.komoditas LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    if (pasar && pasar !== 'all') {
      whereClauses.push('td.titik_tujuan = ?');
      params.push(pasar);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM transportasi_damri td 
       JOIN petani p ON td.petani_id = p.id 
       ${whereSql}`,
      params
    );

    const [trips] = await pool.query(
      `SELECT td.*, p.nama_lengkap as nama_petani, p.nomor_kartu, p.distrik as distrik_petani, p.kampung as kampung_petani
       FROM transportasi_damri td
       JOIN petani p ON td.petani_id = p.id
       ${whereSql}
       ORDER BY td.tanggal_penggunaan DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Summary metrics
    const [[metrics]] = await pool.query(`
      SELECT 
        COUNT(*) as total_trip,
        COALESCE(SUM(volume_kg), 0) as total_kg,
        COUNT(DISTINCT petani_id) as total_petani_terlayani
      FROM transportasi_damri
    `);

    const totalPages = Math.ceil(total / limit) || 1;

    res.render('transport/history', {
      title: 'Riwayat Layanan Transportasi DAMRI - SIM-KARTANI',
      trips,
      total,
      page,
      limit,
      totalPages,
      metrics,
      search: search || '',
      selectedPasar: pasar || 'all'
    });
  } catch (err) {
    console.error('Transport history error:', err);
    res.status(500).send('Terjadi kesalahan memuat riwayat transportasi.');
  }
};
