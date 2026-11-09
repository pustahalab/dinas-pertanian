const pool = require('../config/db');

exports.farmers = async (req, res) => {
  try {
    const { distrik = 'all', status = 'all', export: exportFormat } = req.query;

    let where = [];
    let params = [];

    if (distrik !== 'all') {
      where.push('p.distrik = ?');
      params.push(distrik);
    }
    if (status !== 'all') {
      where.push('p.status_verifikasi = ?');
      params.push(status);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.query(`
      SELECT p.*, k.nama_kelompok 
      FROM petani p 
      LEFT JOIN kelompok_tani k ON p.kelompok_tani_id = k.id 
      ${whereSql} 
      ORDER BY p.distrik ASC, p.nama_lengkap ASC
    `, params);

    // Jika user minta download CSV / Excel
    if (exportFormat === 'csv') {
      let csv = 'NO,NOMOR KARTU,NIK,NAMA LENGKAP,DISTRIK,KAMPUNG,KELOMPOK TANI,KOMODITAS,LUAS LAHAN (HA),STATUS VERIFIKASI,STATUS KARTU\n';
      rows.forEach((r, idx) => {
        csv += `"${idx + 1}","${r.nomor_kartu}","${r.nik}","${r.nama_lengkap}","${r.distrik}","${r.kampung}","${r.nama_kelompok || '-'}","${r.komoditas_utama}","${r.luas_lahan}","${r.status_verifikasi}","${r.status_kartu}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="Laporan_Petani_OAP_Biak_Numfor_2026.csv"');
      return res.send('\uFEFF' + csv);
    }

    const [districts] = await pool.query('SELECT DISTINCT nama_distrik FROM distrik ORDER BY nama_distrik ASC');

    res.render('reports/farmers', {
      title: 'Laporan Data Petani OAP - SIM-KARTANI Biak Numfor',
      farmers: rows,
      districts,
      selectedDistrik: distrik,
      selectedStatus: status
    });
  } catch (err) {
    console.error('Report farmers error:', err);
    res.status(500).send('Terjadi kesalahan memuat laporan petani.');
  }
};

exports.transport = async (req, res) => {
  try {
    const { pasar = 'all', export: exportFormat } = req.query;

    let where = [];
    let params = [];

    if (pasar !== 'all') {
      where.push('td.titik_tujuan = ?');
      params.push(pasar);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.query(`
      SELECT td.*, p.nama_lengkap as nama_petani, p.nomor_kartu, p.distrik, p.kampung 
      FROM transportasi_damri td 
      JOIN petani p ON td.petani_id = p.id 
      ${whereSql} 
      ORDER BY td.tanggal_penggunaan DESC
    `, params);

    // Metrik ringkasan
    const [[summary]] = await pool.query(`
      SELECT 
        COUNT(*) as total_trip,
        COALESCE(SUM(volume_kg), 0) as total_kg,
        COUNT(DISTINCT petani_id) as total_petani
      FROM transportasi_damri
    `);

    if (exportFormat === 'csv') {
      let csv = 'KODE PERJALANAN,TANGGAL,NOMOR KARTU,NAMA PETANI,ASAL (KAMPUNG/DISTRIK),TUJUAN PASAR,KOMODITAS,VOLUME (KG),KEMASAN,ARMADA,STATUS\n';
      rows.forEach((r) => {
        csv += `"${r.kode_perjalanan}","${r.tanggal_penggunaan}","${r.nomor_kartu}","${r.nama_petani}","${r.kampung}, ${r.distrik}","${r.titik_tujuan}","${r.komoditas}","${r.volume_kg}","${r.jenis_kemasan}","${r.nomor_armada}","${r.status_perjalanan}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="Laporan_Transportasi_DAMRI_Biak_2026.csv"');
      return res.send('\uFEFF' + csv);
    }

    res.render('reports/transport', {
      title: 'Laporan Transportasi Pemasaran Hasil Tani (DAMRI) - SIM-KARTANI',
      trips: rows,
      summary,
      selectedPasar: pasar
    });
  } catch (err) {
    console.error('Report transport error:', err);
    res.status(500).send('Terjadi kesalahan memuat laporan transportasi.');
  }
};

exports.aids = async (req, res) => {
  try {
    const { export: exportFormat } = req.query;

    const [rows] = await pool.query(`
      SELECT sb.*, pb.kode_program, pb.nama_program, pb.jenis_bantuan, pb.tahun_anggaran,
             p.nama_lengkap as nama_petani, p.nomor_kartu, p.distrik, p.kampung
      FROM penyaluran_bantuan sb
      JOIN program_bantuan pb ON sb.program_id = pb.id
      JOIN petani p ON sb.petani_id = p.id
      ORDER BY sb.tanggal_penyaluran DESC
    `);

    if (exportFormat === 'csv') {
      let csv = 'PROGRAM BANTUAN,TAHUN,NOMOR KARTU,NAMA PETANI,WILAYAH,VOLUME BANTUAN,NILAI (RP),TANGGAL PENYALURAN,STATUS\n';
      rows.forEach((r) => {
        csv += `"${r.nama_program}","${r.tahun_anggaran}","${r.nomor_kartu}","${r.nama_petani}","${r.kampung}, ${r.distrik}","${r.volume_bantuan}","${r.nilai_perkiraan}","${r.tanggal_penyaluran}","${r.status_realisasi}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="Laporan_Realisasi_Bantuan_Otsus_Biak_2026.csv"');
      return res.send('\uFEFF' + csv);
    }

    res.render('reports/aids', {
      title: 'Laporan Penyaluran Bantuan Otsus - SIM-KARTANI',
      disbursements: rows
    });
  } catch (err) {
    console.error('Report aids error:', err);
    res.status(500).send('Terjadi kesalahan memuat laporan bantuan.');
  }
};
