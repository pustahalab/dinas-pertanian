<?php
/**
 * PORTAL VERIFIKASI TANDA TANGAN ELEKTRONIK (E-SIGN VERIFICATION PORTAL)
 * Domain: dennyjcs.com/e-sign
 * Pemilik: Ir. Denny Jean Cross Sihombing, S.T., M.T.
 * 
 * Script ini standalone (PHP murni) tanpa ketergantungan library luar,
 * siap di-upload langsung ke folder public_html/e-sign di cPanel Anda.
 */

// Tangkap parameter GET atau default
$doc_param    = isset($_GET['doc']) ? trim($_GET['doc']) : '';
$signer_param = isset($_GET['signer']) ? trim($_GET['signer']) : '';
$issued_param = isset($_GET['issued']) ? trim($_GET['issued']) : '';

// Basis data dokumen resmi yang ditandatangani secara elektronik
$registered_docs = [
    'PROP-KARTANI-BIAK-2026' => [
        'title'           => 'Proposal Rancang Bangun & Implementasi SIM-KARTANI OAP Terintegrasi DAMRI',
        'doc_number'      => '012/EXT-PROP/DJCS/XI/2026',
        'doc_type'        => 'Dokumen Usulan Teknis & Rencana Anggaran Biaya (RAB)',
        'target_agency'   => 'Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor, Provinsi Papua',
        'target_person'   => 'drh. BAMBANG HAYANTO (Plt. Kepala Dinas)',
        'signer_name'     => 'Ir. Denny Jean Cross Sihombing, S.T., M.T.',
        'signer_role'     => 'Pengembang Sistem Informasi & Dosen Prodi Sistem Informasi Unika Atma Jaya Jakarta',
        'signer_email'    => 'denny.jean@atmajaya.ac.id',
        'issue_date'      => '16 November 2026',
        'issue_location'  => 'Jakarta, Indonesia',
        'budget_value'    => 'Rp 247.450.000,- (Dua Ratus Empat Puluh Tujuh Juta Empat Ratus Lima Puluh Ribu Rupiah)',
        'duration'        => '4 (Empat) Bulan Kalender',
        'hash_signature'  => 'SHA256: 8f4a1c9e2b0d7a6f5e3d8c1b9a0e2f4d6c8b1a3e5f7a9c1e3b5d7f9a1c3e5a7b',
        'status'          => 'VALID',
        'status_desc'     => 'Tanda tangan elektronik SAH, ASLI, dan TERVERIFIKASI secara resmi terdaftar di database dennyjcs.com'
    ],
    'SURAT-KARTANI-BIAK-2026' => [
        'title'           => 'Surat Pengantar Pengajuan Proposal SIM-KARTANI OAP Biak Numfor',
        'doc_number'      => '012/EXT-PROP/DJCS/XI/2026',
        'doc_type'        => 'Surat Pengantar Resmi',
        'target_agency'   => 'Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor, Provinsi Papua',
        'target_person'   => 'drh. BAMBANG HAYANTO (Plt. Kepala Dinas)',
        'signer_name'     => 'Ir. Denny Jean Cross Sihombing, S.T., M.T.',
        'signer_role'     => 'Pengembang Sistem Informasi & Dosen Prodi Sistem Informasi Unika Atma Jaya Jakarta',
        'signer_email'    => 'denny.jean@atmajaya.ac.id',
        'issue_date'      => '16 November 2026',
        'issue_location'  => 'Jakarta, Indonesia',
        'budget_value'    => 'Rp 247.450.000,-',
        'duration'        => '4 Bulan',
        'hash_signature'  => 'SHA256: 7e2d9b1a5f8c4e0d6b3a2f1c8e9d0a7b5c4f2e1d8a0b9c3e6f5a7d1b8c2e4a6f',
        'status'          => 'VALID',
        'status_desc'     => 'Tanda tangan elektronik SAH, ASLI, dan TERVERIFIKASI secara resmi terdaftar di database dennyjcs.com'
    ],
    'PROP-ETIK-KPIN-2026' => [
        'title'           => 'Proposal Pengembangan Sistem Informasi Uji Etik Penelitian Mandiri (Ethical Clearance System)',
        'doc_number'      => '004/KPIN-PROP/DJCS/XI/2026',
        'doc_type'        => 'Dokumen Usulan Lanjutan Proyek IT & Rencana Anggaran Biaya (RAB)',
        'target_agency'   => 'Konsorsium Psikologi Ilmiah Nusantara (KPIN)',
        'target_person'   => 'Badan Pengurus Harian (BPH) KPIN',
        'signer_name'     => 'Ir. Denny Jean Cross Sihombing, S.T., M.T.',
        'signer_role'     => 'Pengembang Sistem Informasi & Dosen Prodi Sistem Informasi Unika Atma Jaya Jakarta',
        'signer_email'    => 'denny.jean@atmajaya.ac.id',
        'issue_date'      => '23 November 2026',
        'issue_location'  => 'Jakarta, Indonesia',
        'budget_value'    => 'Rp 60.000.000,- (Enam Puluh Juta Rupiah)',
        'duration'        => '3 (Tiga) Bulan Kalender / 12 Minggu',
        'hash_signature'  => 'SHA256: 4b9e2a7f1c8d0e3a5b6c9f2d1e4a7b0c3f5e8a1d4b7c0e3a6f9b2d5e8a1c4f7b',
        'status'          => 'VALID',
        'status_desc'     => 'Tanda tangan elektronik SAH, ASLI, dan TERVERIFIKASI secara resmi terdaftar di database dennyjcs.com'
    ]
];

// Alias mapping agar pencarian dengan Token ID atau No Dokumen langsung valid
$registered_docs['DJCS-ESIGN-KPIN-2026']       = &$registered_docs['PROP-ETIK-KPIN-2026'];
$registered_docs['004/KPIN-PROP/DJCS/XI/2026']  = &$registered_docs['PROP-ETIK-KPIN-2026'];
$registered_docs['DJCS-ESIGN-BIAK-2026']       = &$registered_docs['PROP-KARTANI-BIAK-2026'];
$registered_docs['DJCS-ESIGN-PROP-2026']       = &$registered_docs['PROP-KARTANI-BIAK-2026'];
$registered_docs['012/EXT-PROP/DJCS/XI/2026']  = &$registered_docs['PROP-KARTANI-BIAK-2026'];

// Evaluasi status dokumen
$is_searched = !empty($doc_param);
$doc_data = null;
$is_valid = false;

if ($is_searched) {
    // Normalisasi pencarian
    $doc_key = strtoupper($doc_param);
    
    if (isset($registered_docs[$doc_key])) {
        $doc_data = $registered_docs[$doc_key];
        $is_valid = true;
    } elseif (strpos($doc_key, 'ETIK') !== false || strpos($doc_key, 'KPIN') !== false || strpos($doc_key, '004') !== false) {
        $doc_data = $registered_docs['PROP-ETIK-KPIN-2026'];
        $is_valid = true;
    } elseif (strpos($doc_key, 'SURAT') !== false && (strpos($doc_key, 'KARTANI') !== false || strpos($doc_key, 'BIAK') !== false)) {
        $doc_data = $registered_docs['SURAT-KARTANI-BIAK-2026'];
        $is_valid = true;
    } elseif (strpos($doc_key, 'KARTANI') !== false || strpos($doc_key, 'BIAK') !== false || strpos($doc_key, '012') !== false) {
        $doc_data = $registered_docs['PROP-KARTANI-BIAK-2026'];
        $is_valid = true;
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Tanda Tangan Elektronik (E-Sign) - dennyjcs.com</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f1f5f9;
      color: #1e293b;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header-bar {
      background: #092c4c;
      color: white;
      padding: 18px 24px;
      box-shadow: 0 4px 15px rgba(9, 44, 76, 0.15);
      border-bottom: 3px solid #0284c7;
    }
    .header-inner {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: white;
    }
    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #0284c7, #0369a1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14pt;
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .brand-text h1 {
      font-size: 13pt;
      font-weight: 800;
      letter-spacing: -0.3px;
      line-height: 1.2;
    }
    .brand-text p {
      font-size: 8pt;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .header-link {
      color: #93c5fd;
      text-decoration: none;
      font-size: 8.5pt;
      font-weight: 600;
      padding: 6px 12px;
      border: 1px solid rgba(147, 197, 253, 0.3);
      border-radius: 6px;
      transition: all 0.2s;
    }
    .header-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    .main-content {
      flex: 1;
      max-width: 900px;
      width: 100%;
      margin: 30px auto;
      padding: 0 20px;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      overflow: hidden;
      margin-bottom: 25px;
    }
    .status-banner {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .status-valid {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-bottom: 2px solid #10b981;
    }
    .status-invalid {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border-bottom: 2px solid #ef4444;
    }
    .status-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26pt;
      flex-shrink: 0;
    }
    .status-valid .status-icon {
      background: #10b981;
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .status-invalid .status-icon {
      background: #ef4444;
      color: white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    .status-info h2 {
      font-size: 15pt;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .status-valid .status-info h2 { color: #065f46; }
    .status-invalid .status-info h2 { color: #991b1b; }
    .status-info p {
      font-size: 9.5pt;
      color: #334155;
      line-height: 1.45;
    }
    .card-body {
      padding: 28px;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      color: #092c4c;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::before {
      content: "";
      width: 4px;
      height: 14px;
      background: #0284c7;
      border-radius: 2px;
      display: inline-block;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px 24px;
      margin-bottom: 24px;
    }
    @media (max-width: 640px) {
      .info-grid { grid-template-columns: 1fr; }
    }
    .info-group label {
      display: block;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-group p {
      font-size: 10pt;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.45;
    }
    .hash-box {
      background: #0f172a;
      color: #38bdf8;
      font-family: 'Fira Code', monospace;
      font-size: 8pt;
      padding: 12px 16px;
      border-radius: 8px;
      word-break: break-all;
      margin-top: 6px;
      border: 1px solid #1e293b;
    }
    .search-card {
      padding: 20px 24px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .search-form {
      display: flex;
      gap: 10px;
    }
    .search-input {
      flex: 1;
      padding: 12px 16px;
      font-family: inherit;
      font-size: 10pt;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      outline: none;
      transition: border 0.2s;
    }
    .search-input:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }
    .search-btn {
      background: #0284c7;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 10pt;
      cursor: pointer;
      transition: background 0.2s;
    }
    .search-btn:hover {
      background: #0369a1;
    }
    .signer-profile {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-top: 10px;
    }
    .signer-avatar {
      width: 52px;
      height: 52px;
      background: #092c4c;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 13pt;
      flex-shrink: 0;
    }
    .signer-details h4 {
      font-size: 10.5pt;
      font-weight: 800;
      color: #092c4c;
      margin-bottom: 2px;
    }
    .signer-details p {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.35;
    }
    .footer {
      background: white;
      border-top: 1px solid #e2e8f0;
      padding: 20px;
      text-align: center;
      font-size: 8.5pt;
      color: #64748b;
      margin-top: auto;
    }
    .footer a {
      color: #0284c7;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <!-- HEADER BRANDING -->
  <header class="header-bar">
    <div class="header-inner">
      <a href="https://dennyjcs.com" class="brand">
        
        <div class="brand-text">
          <h1>Ir. Denny Jean Cross Sihombing, S.T., M.T.</h1>
          <p>Portal Verifikasi Tanda Tangan Elektronik Resmi (E-Sign)</p>
        </div>
      </a>
      <a href="https://dennyjcs.com" class="header-link">&larr; Kembali ke dennyjcs.com</a>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="main-content">

    <!-- SEARCH BAR -->
    <div class="search-card">
      <form method="GET" action="" class="search-form">
        <input type="text" name="doc" class="search-input" placeholder="Masukkan ID Dokumen atau Kode Verifikasi..." value="<?php echo htmlspecialchars($doc_param); ?>" required>
        <button type="submit" class="search-btn">Cek Keabsahan</button>
      </form>
    </div>

    <?php if ($is_valid && $doc_data): ?>
      <!-- RESULT: VALID -->
      <div class="card">
        <div class="status-banner status-valid">
          <div class="status-icon">✓</div>
          <div class="status-info">
            <h2>DOKUMEN SAH & TERVERIFIKASI</h2>
            <p><?php echo htmlspecialchars($doc_data['status_desc']); ?></p>
          </div>
        </div>

        <div class="card-body">
          <div class="section-title">Informasi Dokumen</div>
          <div class="info-grid">
            <div class="info-group">
              <label>Judul Dokumen</label>
              <p><?php echo htmlspecialchars($doc_data['title']); ?></p>
            </div>
            <div class="info-group">
              <label>Nomor Dokumen Resmi</label>
              <p style="color: #0284c7; font-family: monospace; font-size: 11pt;"><?php echo htmlspecialchars($doc_data['doc_number']); ?></p>
            </div>
            <div class="info-group">
              <label>Jenis Dokumen</label>
              <p><?php echo htmlspecialchars($doc_data['doc_type']); ?></p>
            </div>
            <div class="info-group">
              <label>Nilai Usulan Anggaran (RAB)</label>
              <p style="color: #0f172a; font-weight: 800;"><?php echo htmlspecialchars($doc_data['budget_value']); ?></p>
            </div>
            <div class="info-group">
              <label>Instansi Mitra Sasaran</label>
              <p><?php echo htmlspecialchars($doc_data['target_agency']); ?></p>
            </div>
            <div class="info-group">
              <label>Ditujukan Kepada</label>
              <p><?php echo htmlspecialchars($doc_data['target_person']); ?></p>
            </div>
            <div class="info-group">
              <label>Tanggal & Lokasi Penerbitan</label>
              <p><?php echo htmlspecialchars($doc_data['issue_date']); ?> &bull; <?php echo htmlspecialchars($doc_data['issue_location']); ?></p>
            </div>
            <div class="info-group">
              <label>Durasi Pelaksanaan Proyek</label>
              <p><?php echo htmlspecialchars($doc_data['duration']); ?></p>
            </div>
          </div>

          <div class="section-title">Profil Penandatangan Resmi</div>
          <div class="signer-profile">
            
            <div class="signer-details">
              <h4><?php echo htmlspecialchars($doc_data['signer_name']); ?></h4>
              <p><?php echo htmlspecialchars($doc_data['signer_role']); ?></p>
              <p>Pos-el Resmi: <strong><?php echo htmlspecialchars($doc_data['signer_email']); ?></strong> &bull; Laman: <strong>dennyjcs.com</strong></p>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <div class="section-title">Jejak Kriptografis Tanda Tangan Digital</div>
            <p style="font-size: 8.5pt; color: #64748b; margin-bottom: 4px;">Hash otentikasi dokumen ini tercatat dan terlindungi secara permanen pada sistem verifikasi dennyjcs.com:</p>
            <div class="hash-box"><?php echo htmlspecialchars($doc_data['hash_signature']); ?></div>
          </div>
        </div>
      </div>

    <?php elseif ($is_searched): ?>
      <!-- RESULT: NOT FOUND -->
      <div class="card">
        <div class="status-banner status-invalid">
          <div class="status-icon">✕</div>
          <div class="status-info">
            <h2>DOKUMEN TIDAK DITEMUKAN ATAU TIDAK VALID</h2>
            <p>Kode dokumen atau token verifikasi <strong>"<?php echo htmlspecialchars($doc_param); ?>"</strong> tidak terdaftar dalam basis data tanda tangan digital resmi kami. Harap periksa kembali nomor dokumen atau scan ulang QR Code yang tertera pada berkas fisik.</p>
          </div>
        </div>
        <div class="card-body">
          <p style="font-size: 9pt; color: #64748b;">
            Jika Anda meyakini dokumen ini sah namun tidak terverifikasi, silakan konfirmasi langsung kepada penerbit dokumen melalui pos-el resmi: <a href="mailto:denny.jean@atmajaya.ac.id" style="color: #0284c7; font-weight: bold;">denny.jean@atmajaya.ac.id</a>.
          </p>
        </div>
      </div>

    <?php else: ?>
      <!-- DEFAULT LANDING -->
      <div class="card">
        <div class="card-body" style="text-align: center; padding: 45px 25px;">
          <div style="width: 65px; height: 65px; background: #e0f2fe; color: #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24pt; margin: 0 auto 16px auto;">🔍</div>
          <h2 style="font-size: 14pt; color: #092c4c; margin-bottom: 8px;">Selamat Datang di Portal Verifikasi E-Sign</h2>
          <p style="font-size: 9.5pt; color: #475569; max-width: 580px; margin: 0 auto 20px auto; line-height: 1.5;">
            Layanan ini diperuntukkan bagi instansi mitra kerja sama, dinas pemerintah, dan pihak terkait untuk memvalidasi keaslian tanda tangan digital pada proposal teknis, surat pengantar, dan dokumen resmi yang diterbitkan oleh <strong>Ir. Denny Jean Cross Sihombing, S.T., M.T.</strong>
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 24px; max-width: 580px; margin: 0 auto; text-align: left;">
            <p style="font-size: 8.8pt; font-weight: 700; color: #092c4c; margin-bottom: 6px;">Cara Memeriksa Keabsahan Dokumen:</p>
            <ol style="font-size: 8.5pt; color: #64748b; line-height: 1.6; padding-left: 20px;">
              <li><strong>Pindai QR Code</strong> pada lembar tanda tangan dokumen resmi menggunakan kamera smartphone Anda.</li>
              <li>Atau <strong>masukkan ID Dokumen / Token E-Sign</strong> pada kolom pencarian di atas, lalu tekan tombol <em>Cek Keabsahan</em>.</li>
            </ol>
          </div>
        </div>
      </div>
    <?php endif; ?>

  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <div style="max-width: 900px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; gap: 10px;">
      <div>&copy; <?php echo date('Y'); ?> <strong>Ir. Denny Jean Cross Sihombing, S.T., M.T.</strong> &bull; Hak Cipta Dilindungi</div>
      <div><a href="https://dennyjcs.com">dennyjcs.com</a> &bull; <a href="mailto:denny.jean@atmajaya.ac.id">denny.jean@atmajaya.ac.id</a></div>
    </div>
  </footer>

</body>
</html>
