const pool = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

exports.index = async (req, res) => {
  try {
    const [groups] = await pool.query(`
      SELECT k.*, 
        (SELECT COUNT(*) FROM petani WHERE kelompok_tani_id = k.id) as anggota_terdaftar 
      FROM kelompok_tani k 
      ORDER BY k.id ASC
    `);

    res.render('groups/index', {
      title: 'Data Kelompok Tani - SIM-KARTANI Biak Numfor',
      groups
    });
  } catch (err) {
    console.error('Group index error:', err);
    res.status(500).send('Terjadi kesalahan memuat data kelompok tani.');
  }
};

exports.detail = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM kelompok_tani WHERE id = ?', [id]);
    if (rows.length === 0) {
      req.flash('error', 'Kelompok tani tidak ditemukan.');
      return res.redirect('/groups');
    }

    const group = rows[0];

    const [members] = await pool.query(`
      SELECT id, nomor_kartu, nama_lengkap, kampung, komoditas_utama, luas_lahan, status_verifikasi, status_kartu 
      FROM petani 
      WHERE kelompok_tani_id = ? 
      ORDER BY nama_lengkap ASC
    `, [id]);

    res.render('groups/detail', {
      title: `Kelompok Tani: ${group.nama_kelompok} - SIM-KARTANI`,
      group,
      members
    });
  } catch (err) {
    console.error('Group detail error:', err);
    res.status(500).send('Terjadi kesalahan memuat detail kelompok tani.');
  }
};
