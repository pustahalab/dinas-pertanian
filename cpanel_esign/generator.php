<?php
/**
 * SISTEM GENERATOR TANDA TANGAN DIGITAL & E-SIGN
 * Domain: dennyjcs.com/e-sign/generator.php
 * Pemilik: Ir. Denny Jean Cross Sihombing, S.T., M.T.
 * 
 * Standalone PHP dengan antarmuka modern, aman dengan PIN,
 * dan dilengkapi fitur Render Stempel Transparan (PNG) serta Web PDF Stamper.
 */

session_start();

// PIN Keamanan untuk mengakses generator (Bisa Anda ubah di sini)
define('ADMIN_PIN', '1977');

// File basis data JSON dokumen
$json_file = __DIR__ . '/documents.json';

// Inisialisasi basis data dari file
$documents = [];
if (file_exists($json_file)) {
    $raw = file_get_contents($json_file);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $documents = $decoded;
    }
}

// Logika Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['esign_auth']);
    session_destroy();
    header('Location: generator.php');
    exit;
}

// Logika Verifikasi PIN
$auth_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    $input_pin = trim($_POST['pin'] ?? '');
    if ($input_pin === ADMIN_PIN) {
        $_SESSION['esign_auth'] = true;
        header('Location: generator.php');
        exit;
    } else {
        $auth_error = 'PIN salah! Silakan coba lagi.';
    }
}

$is_authenticated = !empty($_SESSION['esign_auth']);

// Logika Hapus Dokumen
$msg_success = '';
if ($is_authenticated && isset($_GET['action']) && $_GET['action'] === 'delete' && !empty($_GET['id'])) {
    $del_id = trim($_GET['id']);
    if (isset($documents[$del_id])) {
        unset($documents[$del_id]);
        file_put_contents($json_file, json_encode($documents, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $msg_success = "Dokumen {$del_id} berhasil dihapus dari basis data.";
    }
}

// Logika Tambah / Generate Dokumen Baru
$created_doc = null;
if ($is_authenticated && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_doc') {
    $title         = trim($_POST['title'] ?? '');
    $doc_number    = trim($_POST['doc_number'] ?? '');
    $doc_type      = trim($_POST['doc_type'] ?? 'Dokumen Usulan Teknis & Rencana Anggaran Biaya (RAB)');
    $target_agency = trim($_POST['target_agency'] ?? '');
    $target_person = trim($_POST['target_person'] ?? '');
    $budget_value  = trim($_POST['budget_value'] ?? '');
    $duration      = trim($_POST['duration'] ?? '');
    $issue_date    = trim($_POST['issue_date'] ?? date('d F Y'));
    $issue_location= trim($_POST['issue_location'] ?? 'Jakarta, Indonesia');
    
    // Pembuatan ID Dokumen unik
    $custom_id = strtoupper(trim($_POST['custom_id'] ?? ''));
    if (empty($custom_id)) {
        $clean_agency = preg_replace('/[^A-Za-z0-9]/', '', $target_agency);
        $short_code   = !empty($clean_agency) ? strtoupper(substr($clean_agency, 0, 8)) : 'DOC';
        $rand_suffix  = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
        $doc_id       = 'PROP-' . $short_code . '-' . date('Y') . '-' . $rand_suffix;
    } else {
        $doc_id = $custom_id;
    }

    // Pembuatan Token & Hash SHA-256
    $token_rand = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
    $token = 'DJCS-ESIGN-' . date('Y') . '-' . $token_rand;
    $hash  = 'SHA256: ' . hash('sha256', $doc_id . $title . $target_agency . $issue_date . 'DENNY_JEAN_CROSS');

    $new_doc = [
        'id'             => $doc_id,
        'title'          => $title,
        'doc_number'     => $doc_number,
        'doc_type'       => $doc_type,
        'target_agency'  => $target_agency,
        'target_person'  => $target_person,
        'signer_name'    => 'Ir. Denny Jean Cross Sihombing, S.T., M.T.',
        'signer_role'    => 'Pengembang Sistem Informasi & Dosen Prodi Sistem Informasi Unika Atma Jaya Jakarta',
        'signer_email'   => 'denny.jean@atmajaya.ac.id',
        'issue_date'     => $issue_date,
        'issue_location' => $issue_location,
        'budget_value'   => $budget_value,
        'duration'       => $duration,
        'token'          => $token,
        'hash_signature' => $hash,
        'status'         => 'VALID',
        'status_desc'    => 'Tanda tangan elektronik SAH, ASLI, dan TERVERIFIKASI secara resmi terdaftar di database dennyjcs.com',
        'created_at'     => date('Y-m-d H:i:s')
    ];

    // Simpan ke basis data
    $documents[$doc_id] = $new_doc;
    file_put_contents($json_file, json_encode($documents, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    $created_doc = $new_doc;
    $msg_success = "Dokumen baru '{$title}' berhasil didaftarkan!";
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generator E-Sign & Stempel Digital Resmi - dennyjcs.com</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Library QR Code & PDF-Lib Client-Side -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
  
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
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
      padding: 16px 24px;
      box-shadow: 0 4px 15px rgba(9, 44, 76, 0.15);
      border-bottom: 3px solid #0284c7;
    }
    .header-inner {
      max-width: 1060px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: white;
    }
    .brand-logo {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14pt;
      letter-spacing: -0.5px;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4);
    }
    .brand-title {
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
    .brand-sub {
      font-size: 7.5pt;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .nav-links {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .nav-btn {
      font-size: 8.5pt;
      padding: 7px 14px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }
    .nav-btn-outline {
      background: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .nav-btn-outline:hover {
      background: rgba(255, 255, 255, 0.18);
      color: white;
    }
    .nav-btn-danger {
      background: #ef4444;
      color: white;
    }
    .nav-btn-danger:hover {
      background: #dc2626;
    }

    .main-content {
      max-width: 1060px;
      width: 100%;
      margin: 28px auto;
      padding: 0 20px;
      flex: 1;
    }

    /* CARD STYLES */
    .card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
      overflow: hidden;
    }
    .card-header {
      padding: 18px 24px;
      background: #fafbfc;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-title {
      font-size: 11pt;
      font-weight: 700;
      color: #092c4c;
    }
    .card-body {
      padding: 24px;
    }

    /* TABS */
    .tab-nav {
      display: flex;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 0 16px;
      gap: 6px;
    }
    .tab-btn {
      padding: 12px 18px;
      font-size: 9pt;
      font-weight: 600;
      color: #64748b;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      color: #0284c7;
    }
    .tab-btn.active {
      color: #0284c7;
      border-bottom-color: #0284c7;
      background: #ffffff;
    }

    /* FORM STYLES */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group.full-width {
      grid-column: 1 / -1;
    }
    label {
      font-size: 8.5pt;
      font-weight: 600;
      color: #334155;
    }
    input[type="text"], input[type="password"], select, textarea {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 9pt;
      font-family: inherit;
      color: #1e293b;
      background: #ffffff;
      transition: border-color 0.2s;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }
    .btn-submit {
      background: #0284c7;
      color: white;
      font-weight: 700;
      font-size: 9.5pt;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-submit:hover {
      background: #0369a1;
    }

    /* PREVIEW & BADGE */
    .preview-box {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .badge-signature {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 480px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .badge-meta {
      font-size: 7.2pt;
      color: #475569;
      line-height: 1.35;
      border-left: 2.5px solid #092c4c;
      padding-left: 10px;
    }
    .badge-meta strong {
      color: #092c4c;
      font-size: 7.6pt;
      display: block;
      letter-spacing: 0.2px;
    }
    .badge-signer {
      margin-top: 4px;
      font-weight: 700;
      text-decoration: underline;
      color: #0f172a;
      font-size: 9pt;
    }
    .badge-title {
      font-size: 7.8pt;
      color: #64748b;
      line-height: 1.3;
    }

    /* TABLE */
    .table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
    }
    th, td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background: #f8fafc;
      font-weight: 700;
      color: #334155;
    }
    tr:hover {
      background: #fafbfc;
    }

    /* ALERT */
    .alert-success {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 9pt;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* FOOTER */
    .footer {
      background: #092c4c;
      color: #94a3b8;
      padding: 16px 24px;
      font-size: 8pt;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: auto;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="header-bar">
    <div class="header-inner">
      <a href="generator.php" class="brand">
        <div class="brand-logo">DJ</div>
        <div>
          <div class="brand-title">E-Sign Generator Panel</div>
          <div class="brand-sub">Sistem Tanda Tangan Digital Resmi &bull; dennyjcs.com</div>
        </div>
      </a>
      <div class="nav-links">
        <a href="index.php" target="_blank" class="nav-btn nav-btn-outline">🌐 Buka Portal Verifikasi Publik</a>
        <?php if ($is_authenticated): ?>
          <a href="?action=logout" class="nav-btn nav-btn-danger">🔒 Keluar / Logout</a>
        <?php endif; ?>
      </div>
    </div>
  </header>

  <main class="main-content">

    <?php if (!$is_authenticated): ?>
      <!-- LOGIN VIEW -->
      <div class="card" style="max-width: 420px; margin: 40px auto;">
        <div class="card-header" style="text-align: center; display: block;">
          <h2 class="card-title">🔐 Autentikasi Pengelola E-Sign</h2>
          <p style="font-size: 8pt; color: #64748b; margin-top: 4px;">Masukkan PIN keamanan untuk menerbitkan tanda tangan digital</p>
        </div>
        <div class="card-body">
          <?php if (!empty($auth_error)): ?>
            <div style="background: #fef2f2; color: #991b1b; padding: 10px; border-radius: 6px; font-size: 8.5pt; margin-bottom: 14px;">
              ⚠️ <?php echo htmlspecialchars($auth_error); ?>
            </div>
          <?php endif; ?>
          <form method="POST" action="">
            <input type="hidden" name="action" value="login">
            <div class="form-group" style="margin-bottom: 18px;">
              <label for="pin">PIN Keamanan:</label>
              <input type="password" id="pin" name="pin" placeholder="Masukkan 4 digit PIN..." required autofocus>
            </div>
            <button type="submit" class="btn-submit" style="width: 100%; justify-content: center;">
              Buka Generator →
            </button>
          </form>
        </div>
      </div>

    <?php else: ?>
      <!-- AUTHENTICATED GENERATOR DASHBOARD -->
      
      <?php if (!empty($msg_success)): ?>
        <div class="alert-success">
          <span>✅</span>
          <div><?php echo htmlspecialchars($msg_success); ?></div>
        </div>
      <?php endif; ?>

      <div class="card">
        <!-- TAB NAVIGATION -->
        <div class="tab-nav">
          <button class="tab-btn active" onclick="switchTab('tab-create')">📝 Buat E-Sign Baru</button>
          <button class="tab-btn" onclick="switchTab('tab-stamper')">📄 Tempel ke PDF (PDF Stamper)</button>
          <button class="tab-btn" onclick="switchTab('tab-archive')">📚 Arsip Dokumen (<?php echo count($documents); ?>)</button>
        </div>

        <!-- TAB 1: FORM BUAT E-SIGN -->
        <div id="tab-create" class="card-body">
          <form method="POST" action="" id="createDocForm">
            <input type="hidden" name="action" value="create_doc">
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="title">Judul Dokumen / Proposal: *</label>
                <input type="text" id="title" name="title" placeholder="Contoh: Proposal Rancang Bangun Sistem Informasi ..." required>
              </div>

              <div class="form-group">
                <label for="doc_number">Nomor Surat / Dokumen Resmi:</label>
                <input type="text" id="doc_number" name="doc_number" placeholder="Contoh: 015/EXT-PROP/DJCS/XI/2026">
              </div>

              <div class="form-group">
                <label for="doc_type">Jenis Dokumen:</label>
                <select id="doc_type" name="doc_type">
                  <option value="Dokumen Usulan Teknis & Rencana Anggaran Biaya (RAB)">Dokumen Usulan Teknis & Rencana Anggaran Biaya (RAB)</option>
                  <option value="Surat Pengantar Resmi">Surat Pengantar Resmi</option>
                  <option value="Surat Perjanjian Kerja / Kontrak">Surat Perjanjian Kerja / Kontrak</option>
                  <option value="Laporan Akhir & Berita Acara">Laporan Akhir & Berita Acara</option>
                  <option value="Sertifikat / Surat Keterangan Resmi">Sertifikat / Surat Keterangan Resmi</option>
                  <option value="Dokumen Riset & Publikasi Ilmiah">Dokumen Riset & Publikasi Ilmiah</option>
                </select>
              </div>

              <div class="form-group">
                <label for="target_agency">Instansi Mitra / Tujuan: *</label>
                <input type="text" id="target_agency" name="target_agency" placeholder="Contoh: Dinas Komunikasi dan Informatika ..." required>
              </div>

              <div class="form-group">
                <label for="target_person">Ditujukan Kepada (Pejabat / Pihak Sasaran):</label>
                <input type="text" id="target_person" name="target_person" placeholder="Contoh: Kepala Dinas Kominfo / Pimpinan Instansi">
              </div>

              <div class="form-group">
                <label for="budget_value">Nilai Usulan Anggaran (RAB):</label>
                <input type="text" id="budget_value" name="budget_value" placeholder="Contoh: Rp 60.000.000,- (Enam Puluh Juta Rupiah)">
              </div>

              <div class="form-group">
                <label for="duration">Durasi Pengerjaan:</label>
                <input type="text" id="duration" name="duration" placeholder="Contoh: 3 (Tiga) Bulan Kalender">
              </div>

              <div class="form-group">
                <label for="issue_date">Tanggal Penerbitan:</label>
                <input type="text" id="issue_date" name="issue_date" value="<?php echo date('d F Y'); ?>">
              </div>

              <div class="form-group">
                <label for="custom_id">Kode ID Dokumen Kustom (Opsional):</label>
                <input type="text" id="custom_id" name="custom_id" placeholder="Biarkan kosong untuk dibuatkan otomatis">
              </div>
            </div>

            <button type="submit" class="btn-submit">
              ⚡ Daftarkan Dokumen & Buat E-Sign Sekarang
            </button>
          </form>

          <!-- HASIL GENERATE TANDA TANGAN -->
          <div id="resultSection" style="<?php echo $created_doc ? 'display: block;' : 'display: none;'; ?> margin-top: 32px; border-top: 2px dashed #e2e8f0; padding-top: 24px;">
            <h3 style="font-size: 11pt; color: #092c4c; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>🎉</span> Stempel Tanda Tangan Digital Berhasil Dibuat
            </h3>
            
            <p style="font-size: 8.5pt; color: #64748b; margin-bottom: 16px;">
              Dokumen telah resmi terdaftar di database <strong>dennyjcs.com/e-sign</strong>. Anda dapat mengunduh stempel PNG transparan untuk ditempelkan ke Word/Canva/PDF, atau menggunakan fitur penempel PDF otomatis pada tab berikutnya.
            </p>

            <!-- PREVIEW VISUAL -->
            <div class="preview-box">
              <div id="signaturePreviewBox" class="badge-signature">
                <div id="qrcodeContainer" style="width: 82px; height: 82px; flex-shrink: 0; background: white; padding: 2px; border: 1px solid #cbd5e1; border-radius: 4px;"></div>
                <div>
                  <div class="badge-meta">
                    <strong>DITANDATANGANI ELEKTRONIK</strong>
                    Token: <span id="previewToken" style="font-family: 'Fira Code', monospace; color: #0284c7; font-weight: bold;"><?php echo $created_doc['token'] ?? ''; ?></span><br>
                    Verifikasi: <span style="color: #0284c7; font-weight: 600;">dennyjcs.com/e-sign</span><br>
                    Waktu: <span id="previewDate"><?php echo $created_doc['issue_date'] ?? date('d F Y'); ?></span>
                  </div>
                  <div class="badge-signer">Ir. Denny Jean Cross Sihombing, S.T., M.T.</div>
                  <div class="badge-title">
                    Pengembang Sistem Informasi &bull; Arsitek Perangkat Lunak<br>
                    <em>Dosen Prodi Sistem Informasi, Unika Atma Jaya Jakarta</em><br>
                    Laman Resmi: <strong style="color: #0284c7;">dennyjcs.com</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- ACTION BUTTONS -->
            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
              <button type="button" class="btn-submit" onclick="downloadTransparentStamp()" style="background: #059669;">
                📥 Unduh Stempel TTD PNG (Transparan 300 DPI)
              </button>
              <button type="button" class="btn-submit" onclick="downloadQrOnly()" style="background: #475569;">
                🔲 Unduh QR Code Saja (PNG)
              </button>
              <a id="btnTestVerify" href="index.php?doc=<?php echo urlencode($created_doc['id'] ?? ''); ?>" target="_blank" class="nav-btn nav-btn-outline" style="background: #0284c7; color: white; display: inline-flex; align-items: center; gap: 6px; padding: 12px 18px;">
                🔍 Uji Halaman Verifikasi Dokumen ↗
              </a>
            </div>

            <!-- HIDDEN CANVAS FOR HIGH RES RENDERING -->
            <canvas id="stampCanvas" width="1200" height="380" style="display: none;"></canvas>
          </div>
        </div>

        <!-- TAB 2: PDF STAMPER (CLIENT-SIDE) -->
        <div id="tab-stamper" class="card-body" style="display: none;">
          <h3 style="font-size: 11pt; color: #092c4c; margin-bottom: 8px;">📄 Tempelkan E-Sign Langsung ke Berkas PDF Anda</h3>
          <p style="font-size: 8.5pt; color: #64748b; margin-bottom: 20px;">
            Pilih file PDF yang ingin ditandatangani. Sistem akan menempelkan stempel digital beresolusi tinggi langsung di peramban Anda secara cepat dan 100% aman (berkas PDF tidak diunggah ke peladen).
          </p>

          <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 20px;">
            <input type="file" id="pdfFileInput" accept="application/pdf" style="margin-bottom: 14px;">
            <p style="font-size: 8pt; color: #64748b;">Mendukung berkas PDF berapapun jumlah halamannya.</p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="stampTargetDoc">Pilih Dokumen E-Sign yang Ditempel:</label>
              <select id="stampTargetDoc" onchange="updateStamperDoc()">
                <?php foreach ($documents as $doc_key => $doc_item): ?>
                  <option value="<?php echo htmlspecialchars($doc_key); ?>" <?php echo ($created_doc && $created_doc['id'] === $doc_key) ? 'selected' : ''; ?>>
                    <?php echo htmlspecialchars($doc_item['title'] . ' (' . ($doc_item['token'] ?? $doc_key) . ')'); ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="form-group">
              <label for="stampPageSelect">Pilih Halaman Penempelan:</label>
              <select id="stampPageSelect">
                <option value="last">Halaman Terakhir (Standar Lembar Tanda Tangan)</option>
                <option value="1">Halaman 1 (Halaman Depan / Surat)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="stampPositionSelect">Posisi Stempel:</label>
              <select id="stampPositionSelect">
                <option value="bottom-right">Kanan Bawah (Standar Surat/Proposal Indonesia)</option>
                <option value="bottom-left">Kiri Bawah</option>
                <option value="bottom-center">Tengah Bawah</option>
              </select>
            </div>
          </div>

          <button type="button" class="btn-submit" onclick="stampAndDownloadPdf()" style="background: #059669; width: 100%; justify-content: center; padding: 14px;">
            🚀 Tempelkan Stempel & Unduh PDF Resmi Sekarang
          </button>
          
          <div id="stamperStatus" style="margin-top: 14px; font-size: 9pt; display: none;"></div>
        </div>

        <!-- TAB 3: ARSIP DOKUMEN TERDAFTAR -->
        <div id="tab-archive" class="card-body" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 11pt; color: #092c4c;">Daftar Dokumen E-Sign Resmi yang Aktif</h3>
            <span style="font-size: 8.5pt; color: #64748b;"><?php echo count($documents); ?> Dokumen Terdaftar</span>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID / Token Dokumen</th>
                  <th>Judul Dokumen & Mitra Sasaran</th>
                  <th>Tanggal</th>
                  <th>RAB</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <?php 
                $no = 1;
                foreach ($documents as $key => $doc): 
                ?>
                  <tr>
                    <td><?php echo $no++; ?></td>
                    <td>
                      <strong style="color: #0284c7; font-family: 'Fira Code', monospace; font-size: 8pt; display: block;"><?php echo htmlspecialchars($key); ?></strong>
                      <span style="font-size: 7.2pt; color: #64748b;"><?php echo htmlspecialchars($doc['token'] ?? '-'); ?></span>
                    </td>
                    <td>
                      <strong style="color: #0f172a; font-size: 8.5pt; display: block;"><?php echo htmlspecialchars($doc['title'] ?? '-'); ?></strong>
                      <span style="font-size: 7.8pt; color: #64748b;"><?php echo htmlspecialchars($doc['target_agency'] ?? '-'); ?></span>
                    </td>
                    <td style="white-space: nowrap; font-size: 8pt; color: #475569;"><?php echo htmlspecialchars($doc['issue_date'] ?? '-'); ?></td>
                    <td style="white-space: nowrap; font-weight: 700; color: #0f172a; font-size: 8pt;"><?php echo htmlspecialchars($doc['budget_value'] ?? '-'); ?></td>
                    <td style="white-space: nowrap;">
                      <a href="index.php?doc=<?php echo urlencode($key); ?>" target="_blank" style="color: #0284c7; font-weight: 600; text-decoration: none; margin-right: 10px;">Buka ↗</a>
                      <a href="?action=delete&id=<?php echo urlencode($key); ?>" onclick="return confirm('Yakin ingin menghapus dokumen ini dari sistem verifikasi?');" style="color: #ef4444; text-decoration: none;">Hapus</a>
                    </td>
                  </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    <?php endif; ?>

  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <div>&copy; <?php echo date('Y'); ?> <strong>Ir. Denny Jean Cross Sihombing, S.T., M.T.</strong> &bull; Portal E-Sign dennyjcs.com</div>
  </footer>

  <!-- SCRIPT LOGIKA GENERATOR, QR & PDF-LIB -->
  <script>
    const registeredDocs = <?php echo json_encode($documents, JSON_UNESCAPED_UNICODE); ?>;
    let currentDocData = <?php echo $created_doc ? json_encode($created_doc, JSON_UNESCAPED_UNICODE) : 'null'; ?>;

    // Inisialisasi QR Code jika ada data dokumen yang baru dibuat
    window.addEventListener('DOMContentLoaded', () => {
      if (currentDocData) {
        renderQrPreview(currentDocData);
      }
    });

    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      document.getElementById('tab-create').style.display = 'none';
      document.getElementById('tab-stamper').style.display = 'none';
      document.getElementById('tab-archive').style.display = 'none';

      document.getElementById(tabId).style.display = 'block';
    }

    function renderQrPreview(doc) {
      const qrBox = document.getElementById('qrcodeContainer');
      qrBox.innerHTML = '';

      const verifyUrl = 'https://dennyjcs.com/e-sign?doc=' + encodeURIComponent(doc.id) + 
                        '&signer=Ir.+Denny+Jean+Cross+Sihombing,+S.T.,+M.T.&issued=' + encodeURIComponent(doc.issue_date || '');

      new QRCode(qrBox, {
        text: verifyUrl,
        width: 78,
        height: 78,
        colorDark: '#092c4c',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });

      document.getElementById('previewToken').innerText = doc.token || doc.id;
      document.getElementById('previewDate').innerText = doc.issue_date || '<?php echo date('d F Y'); ?>';
      document.getElementById('btnTestVerify').href = 'index.php?doc=' + encodeURIComponent(doc.id);
    }

    // Render Transparent PNG Stamp via High-Res HTML5 Canvas
    function drawStampToCanvas(doc, callback) {
      const canvas = document.getElementById('stampCanvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pastikan QR Code sudah ter-render sebagai image di container
      const qrImg = document.querySelector('#qrcodeContainer img') || document.querySelector('#qrcodeContainer canvas');
      if (!qrImg) {
        alert('QR Code sedang disiapkan, silakan klik lagi.');
        return;
      }

      // Ukuran Canvas: 1200 x 360 px (Sangat tajam dan jernih untuk cetak A4 300 DPI)
      const qrSize = 220;
      const startX = 30;
      const startY = 70;

      // Draw QR Image
      ctx.drawImage(qrImg, startX, startY, qrSize, qrSize);

      // Draw Accent Vertical Line
      const lineX = startX + qrSize + 30;
      ctx.fillStyle = '#092c4c';
      ctx.fillRect(lineX, startY + 5, 6, qrSize - 10);

      // Draw Text Details
      const textX = lineX + 25;
      let textY = startY + 28;

      ctx.fillStyle = '#092c4c';
      ctx.font = 'bold 26px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillText('DITANDATANGANI SECARA ELEKTRONIK', textX, textY);

      textY += 32;
      ctx.fillStyle = '#475569';
      ctx.font = '20px "Fira Code", monospace';
      ctx.fillText('Token ID: ' + (doc.token || doc.id), textX, textY);

      textY += 28;
      ctx.font = '19px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillText('Verifikasi Resmi: dennyjcs.com/e-sign', textX, textY);

      textY += 28;
      ctx.fillText('Waktu Penerbitan: ' + (doc.issue_date || '<?php echo date('d F Y'); ?>'), textX, textY);

      textY += 38;
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillText('Ir. Denny Jean Cross Sihombing, S.T., M.T.', textX, textY);
      
      // Underline for name
      ctx.fillRect(textX, textY + 6, 560, 2);

      textY += 34;
      ctx.fillStyle = '#475569';
      ctx.font = '20px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillText('Pengembang Sistem Informasi • Arsitek Perangkat Lunak', textX, textY);

      textY += 26;
      ctx.font = 'italic 18px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillText('Dosen Program Studi Sistem Informasi, Unika Atma Jaya Jakarta', textX, textY);

      textY += 26;
      ctx.font = 'bold 18px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillStyle = '#0284c7';
      ctx.fillText('Laman Resmi: dennyjcs.com', textX, textY);

      if (callback) callback(canvas);
    }

    function downloadTransparentStamp() {
      if (!currentDocData) {
        alert('Silakan daftarkan dokumen terlebih dahulu.');
        return;
      }
      drawStampToCanvas(currentDocData, (canvas) => {
        const link = document.createElement('a');
        link.download = 'E-SIGN_' + (currentDocData.token || currentDocData.id) + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }

    function downloadQrOnly() {
      const qrImg = document.querySelector('#qrcodeContainer img') || document.querySelector('#qrcodeContainer canvas');
      if (!qrImg) return;
      const link = document.createElement('a');
      link.download = 'QR_' + (currentDocData.token || currentDocData.id) + '.png';
      link.href = qrImg.src || qrImg.toDataURL('image/png');
      link.click();
    }

    function updateStamperDoc() {
      const selectedId = document.getElementById('stampTargetDoc').value;
      if (registeredDocs[selectedId]) {
        currentDocData = registeredDocs[selectedId];
        renderQrPreview(currentDocData);
      }
    }

    // Fitur Tempel Langsung ke PDF menggunakan PDF-Lib
    async function stampAndDownloadPdf() {
      const fileInput = document.getElementById('pdfFileInput');
      const statusDiv = document.getElementById('stamperStatus');
      
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Silakan pilih berkas PDF terlebih dahulu.');
        return;
      }

      const selectedId = document.getElementById('stampTargetDoc').value;
      const doc = registeredDocs[selectedId] || currentDocData;
      if (!doc) {
        alert('Silakan pilih data dokumen tanda tangan.');
        return;
      }

      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<span style="color: #0284c7;">⏳ Memproses penempelan tanda tangan ke PDF...</span>';

      try {
        const file = fileInput.files[0];
        const arrayBuffer = await file.arrayBuffer();

        // Load PDF Document
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const totalPages = pages.length;

        // Pilih halaman target
        const pageOption = document.getElementById('stampPageSelect').value;
        let targetPage = pages[totalPages - 1]; // default last
        if (pageOption === '1' && pages[0]) {
          targetPage = pages[0];
        }

        // Render stamp image ke Canvas lalu export base64
        drawStampToCanvas(doc, async (canvas) => {
          const stampPngBytes = await fetch(canvas.toDataURL('image/png')).then(res => res.arrayBuffer());
          const stampImage = await pdfDoc.embedPng(stampPngBytes);

          // Ukuran tampilan stempel pada PDF A4 (proporsional & elegan)
          const stampWidth = 240;
          const stampHeight = (stampWidth / canvas.width) * canvas.height;

          const { width, height } = targetPage.getSize();
          const positionOption = document.getElementById('stampPositionSelect').value;

          let posX = width - stampWidth - 45; // Kanan bawah
          let posY = 50;

          if (positionOption === 'bottom-left') {
            posX = 45;
          } else if (positionOption === 'bottom-center') {
            posX = (width - stampWidth) / 2;
          }

          // Tempelkan gambar tanda tangan ke halaman
          targetPage.drawImage(stampImage, {
            x: posX,
            y: posY,
            width: stampWidth,
            height: stampHeight,
          });

          // Simpan & Unduh PDF
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = file.name.replace('.pdf', '') + '_SIGNED.pdf';
          link.click();

          statusDiv.innerHTML = '<span style="color: #059669; font-weight: bold;">✅ Berhasil! PDF yang telah bertanda tangan resmi telah diunduh.</span>';
        });

      } catch (err) {
        console.error(err);
        statusDiv.innerHTML = '<span style="color: #ef4444;">❌ Gagal memproses PDF: ' + err.message + '</span>';
      }
    }
  </script>

</body>
</html>
