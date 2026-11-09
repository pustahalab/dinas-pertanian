const pool = require('../config/db');
const { logAudit } = require('../utils/auditLogger');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '15', 10);
    const offset = (page - 1) * limit;

    const { search, distrik, status } = req.query;

    let whereClauses = [];
    let params = [];

    if (search && search.trim()) {
      whereClauses.push('(p.nama_lengkap LIKE ? OR p.nomor_kartu LIKE ? OR p.nik LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    if (distrik && distrik !== 'all') {
      whereClauses.push('p.distrik = ?');
      params.push(distrik);
    }

    if (status && status !== 'all') {
      whereClauses.push('p.status_verifikasi = ?');
      params.push(status);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count total records
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM petani p ${whereSql}`,
      params
    );

    // Fetch records
    const [farmers] = await pool.query(
      `SELECT p.*, k.nama_kelompok 
       FROM petani p 
       LEFT JOIN kelompok_tani k ON p.kelompok_tani_id = k.id 
       ${whereSql} 
       ORDER BY p.id ASC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Fetch all distrik for filter dropdown
    const [districts] = await pool.query('SELECT DISTINCT nama_distrik FROM distrik ORDER BY nama_distrik ASC');

    const totalPages = Math.ceil(total / limit) || 1;

    res.render('farmers/index', {
      title: 'Data Petani OAP - SIM-KARTANI Biak Numfor',
      farmers,
      total,
      page,
      limit,
      totalPages,
      districts,
      search: search || '',
      selectedDistrik: distrik || 'all',
      selectedStatus: status || 'all'
    });
  } catch (err) {
    console.error('Farmer index error:', err);
    res.status(500).send('Terjadi kesalahan memuat data petani.');
  }
};

exports.detail = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT p.*, k.nama_kelompok, k.nama_ketua as ketua_poktan,
              u_verif.nama_lengkap as nama_verifikator,
              u_tetap.nama_lengkap as nama_penetap
       FROM petani p
       LEFT JOIN kelompok_tani k ON p.kelompok_tani_id = k.id
       LEFT JOIN users u_verif ON p.verifikator_id = u_verif.id
       LEFT JOIN users u_tetap ON p.penetap_id = u_tetap.id
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      req.flash('error', 'Petani tidak ditemukan.');
      return res.redirect('/farmers');
    }

    const farmer = rows[0];

    // Ambil riwayat bantuan
    const [aids] = await pool.query(
      `SELECT sb.*, pb.nama_program, pb.jenis_bantuan, pb.tahun_anggaran 
       FROM penyaluran_bantuan sb 
       JOIN program_bantuan pb ON sb.program_id = pb.id 
       WHERE sb.petani_id = ? 
       ORDER BY sb.tanggal_penyaluran DESC`,
      [id]
    );

    // Ambil riwayat transportasi DAMRI
    const [trips] = await pool.query(
      `SELECT * FROM transportasi_damri 
       WHERE petani_id = ? 
       ORDER BY tanggal_penggunaan DESC`,
      [id]
    );

    res.render('farmers/detail', {
      title: `Profil Petani: ${farmer.nama_lengkap} - SIM-KARTANI`,
      farmer,
      aids,
      trips
    });
  } catch (err) {
    console.error('Farmer detail error:', err);
    res.status(500).send('Terjadi kesalahan memuat detail petani.');
  }
};

exports.createForm = async (req, res) => {
  try {
    const [districts] = await pool.query('SELECT * FROM distrik ORDER BY nama_distrik ASC');
    const [kampungs] = await pool.query('SELECT * FROM kampung ORDER BY nama_kampung ASC');
    const [groups] = await pool.query('SELECT id, nama_kelompok, distrik FROM kelompok_tani ORDER BY nama_kelompok ASC');

    res.render('farmers/create', {
      title: 'Tambah Petani OAP Baru - SIM-KARTANI',
      districts,
      kampungs,
      groups
    });
  } catch (err) {
    console.error('Farmer create form error:', err);
    res.status(500).send('Terjadi kesalahan membuka form petani.');
  }
};

exports.create = async (req, res) => {
  try {
    const {
      nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin,
      no_hp, alamat, distrik, kampung, kelompok_tani_id,
      komoditas_utama, luas_lahan, estimasi_panen_kg
    } = req.body;

    // Generate Nomor Kartu Tani OAP Baru
    const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id), 0) + 1 as maxId FROM petani');
    const formattedNum = String(maxId).padStart(4, '0');
    const nomorKartu = `KT-OAP-2026-${formattedNum}`;
    const qrToken = `KTOAP-${formattedNum}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Status awal: 'diajukan'
    const statusVerifikasi = 'diajukan';
    const statusKartu = 'nonaktif';

    // Generate QR file
    const qrDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'qrcodes');
    fs.mkdirSync(qrDir, { recursive: true });
    const qrPayload = JSON.stringify({
      nomor_kartu: nomorKartu,
      nama: nama_lengkap.toUpperCase(),
      distrik,
      kampung,
      status: 'NON-AKTIF',
      token: qrToken
    });
    await QRCode.toFile(path.join(qrDir, `${nomorKartu}.png`), qrPayload, {
      width: 300,
      margin: 2,
      color: { dark: '#1b4332', light: '#ffffff' }
    });

    const [insertResult] = await pool.query(
      `INSERT INTO petani (
        nomor_kartu, nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin,
        no_hp, alamat, distrik, kampung, kelompok_tani_id, status_oap,
        komoditas_utama, luas_lahan, estimasi_panen_kg, status_verifikasi, status_kartu,
        catatan_verifikasi, foto, qr_code_token
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OAP', ?, ?, ?, ?, ?, ?, '/img/default-avatar.png', ?)`,
      [
        nomorKartu,
        nik,
        nama_lengkap.toUpperCase(),
        tempat_lahir || 'Biak',
        tanggal_lahir || null,
        jenis_kelamin || 'L',
        no_hp || null,
        alamat || `Kampung ${kampung}, Distrik ${distrik}`,
        distrik,
        kampung,
        kelompok_tani_id ? parseInt(kelompok_tani_id, 10) : null,
        komoditas_utama || 'Keladi Biak',
        parseFloat(luas_lahan) || 0.50,
        parseFloat(estimasi_panen_kg) || 300.00,
        statusVerifikasi,
        statusKartu,
        'Data baru didaftarkan ke sistem, menunggu verifikasi lapangan.',
        qrToken
      ]
    );

    await logAudit(req, 'TAMBAH_PETANI', 'petani', insertResult.insertId, `Pendaftaran petani baru: ${nama_lengkap} (${nomorKartu})`);
    req.flash('success', `Data petani [${nama_lengkap}] berhasil didaftarkan dengan Nomor Kartu [${nomorKartu}].`);
    return res.redirect(`/farmers/${insertResult.insertId}`);
  } catch (err) {
    console.error('Farmer create error:', err);
    req.flash('error', `Gagal mendaftarkan petani: ${err.message}`);
    return res.redirect('/farmers/create');
  }
};

exports.editForm = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM petani WHERE id = ?', [id]);
    if (rows.length === 0) {
      req.flash('error', 'Petani tidak ditemukan.');
      return res.redirect('/farmers');
    }
    const [districts] = await pool.query('SELECT * FROM distrik ORDER BY nama_distrik ASC');
    const [kampungs] = await pool.query('SELECT * FROM kampung ORDER BY nama_kampung ASC');
    const [groups] = await pool.query('SELECT id, nama_kelompok, distrik FROM kelompok_tani ORDER BY nama_kelompok ASC');

    res.render('farmers/edit', {
      title: `Ubah Data Petani: ${rows[0].nama_lengkap} - SIM-KARTANI`,
      farmer: rows[0],
      districts,
      kampungs,
      groups
    });
  } catch (err) {
    console.error('Farmer edit form error:', err);
    res.status(500).send('Terjadi kesalahan membuka form edit.');
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_lengkap, nik, no_hp, alamat, distrik, kampung,
      kelompok_tani_id, komoditas_utama, luas_lahan, estimasi_panen_kg
    } = req.body;

    await pool.query(
      `UPDATE petani SET
        nama_lengkap = ?,
        nik = ?,
        no_hp = ?,
        alamat = ?,
        distrik = ?,
        kampung = ?,
        kelompok_tani_id = ?,
        komoditas_utama = ?,
        luas_lahan = ?,
        estimasi_panen_kg = ?
       WHERE id = ?`,
      [
        nama_lengkap.toUpperCase(),
        nik,
        no_hp,
        alamat,
        distrik,
        kampung,
        kelompok_tani_id ? parseInt(kelompok_tani_id, 10) : null,
        komoditas_utama,
        parseFloat(luas_lahan) || 0.50,
        parseFloat(estimasi_panen_kg) || 300.00,
        id
      ]
    );

    await logAudit(req, 'UPDATE_PETANI', 'petani', id, `Pembaruan data petani: ${nama_lengkap}`);
    req.flash('success', 'Data petani berhasil diperbarui.');
    return res.redirect(`/farmers/${id}`);
  } catch (err) {
    console.error('Farmer update error:', err);
    req.flash('error', `Gagal memperbarui petani: ${err.message}`);
    return res.redirect(`/farmers/${id}/edit`);
  }
};

exports.verify = async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan_verifikasi, action } = req.body;
    const verifikatorId = req.session.user.id;

    const newStatus = action === 'reject' ? 'ditolak' : 'terverifikasi';
    const cardStatus = 'nonaktif';

    await pool.query(
      `UPDATE petani SET 
        status_verifikasi = ?, 
        status_kartu = ?, 
        verifikator_id = ?, 
        tanggal_verifikasi = NOW(), 
        catatan_verifikasi = ? 
       WHERE id = ?`,
      [newStatus, cardStatus, verifikatorId, catatan_verifikasi || 'Verifikasi lapangan telah dilakukan.', id]
    );

    await logAudit(req, 'VERIFIKASI_PETANI', 'petani', id, `Petugas memverifikasi petani ID ${id} menjadi [${newStatus}]`);
    req.flash('success', `Status petani berhasil diperbarui menjadi [${newStatus.toUpperCase()}].`);
    return res.redirect(`/farmers/${id}`);
  } catch (err) {
    console.error('Farmer verify error:', err);
    req.flash('error', 'Gagal memverifikasi data petani.');
    return res.redirect(`/farmers/${id}`);
  }
};

exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, catatan } = req.body;
    const penetapId = req.session.user.id;

    const isApprove = action === 'approve';
    const statusVerifikasi = isApprove ? 'ditetapkan' : 'ditolak';
    const statusKartu = isApprove ? 'aktif' : 'nonaktif';

    // Update petani
    await pool.query(
      `UPDATE petani SET 
        status_verifikasi = ?, 
        status_kartu = ?, 
        penetap_id = ?, 
        tanggal_penetapan = NOW(), 
        catatan_verifikasi = CONCAT(COALESCE(catatan_verifikasi, ''), '\n[Penetapan Pimpinan]: ', ?) 
       WHERE id = ?`,
      [statusVerifikasi, statusKartu, penetapId, catatan || (isApprove ? 'Ditetapkan sebagai penerima bantuan Otsus & Kartu Tani OAP diaktifkan.' : 'Ditolak.'), id]
    );

    // Perbarui file QR Code
    const [pRows] = await pool.query('SELECT * FROM petani WHERE id = ?', [id]);
    if (pRows.length > 0) {
      const f = pRows[0];
      const qrDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'qrcodes');
      fs.mkdirSync(qrDir, { recursive: true });
      const qrPayload = JSON.stringify({
        nomor_kartu: f.nomor_kartu,
        nama: f.nama_lengkap,
        distrik: f.distrik,
        kampung: f.kampung,
        status: statusKartu === 'aktif' ? 'VALID' : 'NON-AKTIF',
        token: f.qr_code_token
      });
      await QRCode.toFile(path.join(qrDir, `${f.nomor_kartu}.png`), qrPayload, {
        width: 300,
        margin: 2,
        color: { dark: '#1b4332', light: '#ffffff' }
      });
    }

    await logAudit(req, 'PENETAPAN_PENERIMA', 'petani', id, `Kepala Dinas/Pimpinan menetapkan petani ID ${id} menjadi [${statusVerifikasi}] - Kartu: ${statusKartu}`);
    req.flash('success', `Kepala Dinas berhasil ${isApprove ? 'MENETAPKAN penerima bantuan dan mengaktifkan Kartu Tani OAP' : 'MENOLAK penetapan penerima'}.`);
    return res.redirect(`/farmers/${id}`);
  } catch (err) {
    console.error('Farmer approve error:', err);
    req.flash('error', 'Gagal memproses penetapan petani.');
    return res.redirect(`/farmers/${id}`);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const [pRows] = await pool.query('SELECT nama_lengkap, nomor_kartu FROM petani WHERE id = ?', [id]);
    if (pRows.length > 0) {
      await pool.query('DELETE FROM petani WHERE id = ?', [id]);
      await logAudit(req, 'HAPUS_PETANI', 'petani', id, `Menghapus petani: ${pRows[0].nama_lengkap} (${pRows[0].nomor_kartu})`);
      req.flash('success', `Data petani [${pRows[0].nama_lengkap}] berhasil dihapus.`);
    }
    return res.redirect('/farmers');
  } catch (err) {
    console.error('Farmer delete error:', err);
    req.flash('error', 'Gagal menghapus data petani.');
    return res.redirect('/farmers');
  }
};
