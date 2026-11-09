const pool = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

exports.index = async (req, res) => {
  try {
    const [programs] = await pool.query(`
      SELECT pb.*, 
        (SELECT COUNT(*) FROM penyaluran_bantuan WHERE program_id = pb.id AND status_realisasi = 'tersalurkan') as total_tersalurkan,
        (SELECT COALESCE(SUM(nilai_perkiraan), 0) FROM penyaluran_bantuan WHERE program_id = pb.id) as total_nilai_terealisasi
      FROM program_bantuan pb
      ORDER BY pb.tahun_anggaran DESC, pb.id ASC
    `);

    const [recentDisbursements] = await pool.query(`
      SELECT sb.*, pb.nama_program, pb.jenis_bantuan, p.nama_lengkap as nama_petani, p.nomor_kartu, p.distrik, p.kampung
      FROM penyaluran_bantuan sb
      JOIN program_bantuan pb ON sb.program_id = pb.id
      JOIN petani p ON sb.petani_id = p.id
      ORDER BY sb.tanggal_penyaluran DESC
      LIMIT 10
    `);

    res.render('aids/index', {
      title: 'Program Bantuan Otonomi Khusus (Otsus) - SIM-KARTANI',
      programs,
      recentDisbursements
    });
  } catch (err) {
    console.error('Aid index error:', err);
    res.status(500).send('Terjadi kesalahan memuat data program bantuan.');
  }
};

exports.programDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM program_bantuan WHERE id = ?', [id]);
    if (rows.length === 0) {
      req.flash('error', 'Program bantuan tidak ditemukan.');
      return res.redirect('/aids');
    }

    const program = rows[0];

    const [recipients] = await pool.query(`
      SELECT sb.*, p.nama_lengkap as nama_petani, p.nomor_kartu, p.distrik, p.kampung, p.komoditas_utama
      FROM penyaluran_bantuan sb
      JOIN petani p ON sb.petani_id = p.id
      WHERE sb.program_id = ?
      ORDER BY sb.tanggal_penyaluran DESC
    `, [id]);

    res.render('aids/program_detail', {
      title: `Detail Program: ${program.nama_program} - SIM-KARTANI`,
      program,
      recipients
    });
  } catch (err) {
    console.error('Program detail error:', err);
    res.status(500).send('Terjadi kesalahan memuat detail program.');
  }
};

exports.disburseForm = async (req, res) => {
  try {
    const { program_id, petani_id } = req.query;

    const [programs] = await pool.query('SELECT id, kode_program, nama_program, jenis_bantuan FROM program_bantuan WHERE status = "aktif"');
    const [farmers] = await pool.query('SELECT id, nomor_kartu, nama_lengkap, distrik, kampung FROM petani WHERE status_verifikasi = "ditetapkan" ORDER BY nama_lengkap ASC LIMIT 200');

    res.render('aids/disburse', {
      title: 'Penyaluran Bantuan Otsus ke Petani - SIM-KARTANI',
      programs,
      farmers,
      selectedProgramId: program_id || null,
      selectedPetaniId: petani_id || null
    });
  } catch (err) {
    console.error('Aid disburse form error:', err);
    res.status(500).send('Terjadi kesalahan membuka form penyaluran bantuan.');
  }
};

exports.saveDisburse = async (req, res) => {
  try {
    const { program_id, petani_id, volume_bantuan, nilai_perkiraan, tanggal_penyaluran, lokasi_penyaluran, catatan } = req.body;
    const petugasPenyalur = req.session.user.nama_lengkap;

    const [result] = await pool.query(`
      INSERT INTO penyaluran_bantuan (
        program_id, petani_id, volume_bantuan, nilai_perkiraan,
        tanggal_penyaluran, lokasi_penyaluran, petugas_penyalur, status_realisasi, catatan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'tersalurkan', ?)
    `, [
      program_id,
      petani_id,
      volume_bantuan,
      parseFloat(nilai_perkiraan) || 0,
      tanggal_penyaluran || new Date().toISOString().slice(0, 10),
      lokasi_penyaluran || 'Kantor Distrik Biak',
      petugasPenyalur,
      catatan
    ]);

    await logAudit(req, 'PENYALURAN_BANTUAN', 'penyaluran_bantuan', result.insertId, `Penyaluran bantuan program ID ${program_id} kepada petani ID ${petani_id}`);
    req.flash('success', 'Penyaluran bantuan Otsus berhasil dicatat ke sistem.');
    return res.redirect(`/aids/programs/${program_id}`);
  } catch (err) {
    console.error('Save disburse error:', err);
    req.flash('error', `Gagal mencatat penyaluran bantuan: ${err.message}`);
    return res.redirect('/aids/disburse');
  }
};
