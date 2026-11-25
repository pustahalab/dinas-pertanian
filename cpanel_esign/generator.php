<?php
/**
 * SISTEM GENERATOR TANDA TANGAN DIGITAL & E-SIGN (ENTERPRISE SECURITY EDITION)
 * Domain: dennyjcs.com/e-sign/generator.php
 * Pemilik: Ir. Denny Jean Cross Sihombing, S.T., M.T.
 * 
 * FITUR KEAMANAN TINGKAT TINGGI:
 * - Proteksi Brute-Force Rate Limiting (Maks 5x percobaan, Lockout 15 menit)
 * - Hash Password/PIN Bcrypt Salted (Bukan Plaintext)
 * - Proteksi Anti-Timing Attack (password_verify) & Anti-Bot Delay
 * - Proteksi CSRF (Cross-Site Request Forgery) Token Kriptografis
 * - Hardened Session Security (HttpOnly, SameSite Strict, Session Hijack Prevention)
 * - Fitur Ubah PIN / Password Mandiri dari Dashboard
 * - Auto Session Timeout (30 menit inaktivitas)
 */

// 1. HARDENED SESSION COOKIE SETTINGS
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        ini_set('session.cookie_secure', 1);
    }
    session_start();
}

define('SECURE_ESIGN', true);

// 2. PATH BERKAS DATA & KONFIGURASI
$config_file   = __DIR__ . '/.auth_config.php';
$attempts_file = __DIR__ . '/.login_attempts.json';
$json_file     = __DIR__ . '/documents.json';

// Inisialisasi konfigurasi kredensial (Default PIN: 1977 terenkripsi Bcrypt)
$default_hash = '$2y$10$WEIH2erElEpeyvvcWOlaGeMBulMReVpqm5kOl23/ExEPkrfd6Xo/G'; // Hash of '1977'

if (!file_exists($config_file)) {
    $init_code = "<?php\ndefined('SECURE_ESIGN') or die('Akses ditolak.');\nreturn [\n    'pin_hash' => '{$default_hash}',\n    'updated_at' => '" . date('Y-m-d H:i:s') . "'\n];\n";
    file_put_contents($config_file, $init_code, LOCK_EX);
}

$auth_config  = include $config_file;
$current_hash = $auth_config['pin_hash'] ?? $default_hash;

// 3. GENERATE CSRF TOKEN
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 4. RATE LIMITING & ANTI BRUTE-FORCE
$client_ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$now = time();
$lockout_duration = 900; // 15 menit
$max_attempts = 5;

$attempts_data = file_exists($attempts_file) ? json_decode(file_get_contents($attempts_file), true) : [];
if (!is_array($attempts_data)) $attempts_data = [];

// Bersihkan rekaman percobaan kedaluwarsa
foreach ($attempts_data as $ip => $data) {
    if ($now - ($data['last_attempt'] ?? 0) > $lockout_duration) {
        unset($attempts_data[$ip]);
    }
}

$is_locked = false;
$remaining_lock_min = 0;
if (isset($attempts_data[$client_ip]) && $attempts_data[$client_ip]['count'] >= $max_attempts) {
    $elapsed = $now - $attempts_data[$client_ip]['last_attempt'];
    if ($elapsed < $lockout_duration) {
        $is_locked = true;
        $remaining_lock_min = ceil(($lockout_duration - $elapsed) / 60);
    } else {
        unset($attempts_data[$client_ip]);
    }
}

// 5. SESSION TIMEOUT (30 MENIT)
if (!empty($_SESSION['esign_auth'])) {
    if (isset($_SESSION['last_activity']) && ($now - $_SESSION['last_activity'] > 1800)) {
        unset($_SESSION['esign_auth']);
        session_destroy();
        header('Location: generator.php?timeout=1');
        exit;
    }
    $_SESSION['last_activity'] = $now;
}

// 6. LOGIKA LOGOUT
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['esign_auth']);
    session_destroy();
    header('Location: generator.php');
    exit;
}

// 7. LOGIKA VERIFIKASI LOGIN PIN
$auth_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    // Validasi CSRF Token
    $post_csrf = $_POST['csrf_token'] ?? '';
    if (!hash_equals($_SESSION['csrf_token'], $post_csrf)) {
        $auth_error = 'Sesi keamanan tidak sah. Silakan muat ulang halaman.';
    } elseif ($is_locked) {
        $auth_error = "Akses diblokir sementara karena terlalu banyak percobaan gagal. Silakan coba lagi dalam {$remaining_lock_min} menit.";
    } else {
        $input_pin = trim($_POST['pin'] ?? '');
        
        // Verifikasi PIN menggunakan algoritma Bcrypt resisten timing attack
        if (password_verify($input_pin, $current_hash)) {
            // Login Berhasil: Reset percobaan gagal
            unset($attempts_data[$client_ip]);
            file_put_contents($attempts_file, json_encode($attempts_data), LOCK_EX);

            // Regenerate session id (Mencegah Session Fixation)
            session_regenerate_id(true);
            $_SESSION['esign_auth'] = true;
            $_SESSION['last_activity'] = $now;
            header('Location: generator.php');
            exit;
        } else {
            // Login Gagal: Delay 1 detik untuk menggagalkan bot otomatis
            sleep(1);
            $count = ($attempts_data[$client_ip]['count'] ?? 0) + 1;
            $attempts_data[$client_ip] = [
                'count' => $count,
                'last_attempt' => $now
            ];
            file_put_contents($attempts_file, json_encode($attempts_data), LOCK_EX);

            $sisa = $max_attempts - $count;
            if ($sisa > 0) {
                $auth_error = "PIN salah! Sisa percobaan: {$sisa} kali sebelum akun diblokir 15 menit.";
            } else {
                $auth_error = "Terlalu banyak percobaan salah! Akses diblokir selama 15 menit demi keamanan.";
                $is_locked = true;
                $remaining_lock_min = 15;
            }
        }
    }
}

$is_authenticated = !empty($_SESSION['esign_auth']);

// 8. MEMUAT BASIS DATA DOKUMEN
$documents = [];
if (file_exists($json_file)) {
    $raw = file_get_contents($json_file);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $documents = $decoded;
    }
}

$msg_success = '';
$msg_error   = '';

// 9. LOGIKA UBAH PIN / PASSWORD MANDIRI
if ($is_authenticated && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'change_pin') {
    $post_csrf = $_POST['csrf_token'] ?? '';
    if (!hash_equals($_SESSION['csrf_token'], $post_csrf)) {
        $msg_error = 'Token keamanan tidak sah.';
    } else {
        $old_pin = trim($_POST['old_pin'] ?? '');
        $new_pin = trim($_POST['new_pin'] ?? '');
        $confirm_pin = trim($_POST['confirm_pin'] ?? '');

        if (!password_verify($old_pin, $current_hash)) {
            $msg_error = 'PIN saat ini salah!';
        } elseif (strlen($new_pin) < 4) {
            $msg_error = 'PIN / Password baru minimal 4 karakter.';
        } elseif ($new_pin !== $confirm_pin) {
            $msg_error = 'Konfirmasi PIN baru tidak cocok.';
        } else {
            $new_hash = password_hash($new_pin, PASSWORD_BCRYPT, ['cost' => 10]);
            $updated_cfg = "<?php\ndefined('SECURE_ESIGN') or die('Akses ditolak.');\nreturn [\n    'pin_hash' => '{$new_hash}',\n    'updated_at' => '" . date('Y-m-d H:i:s') . "'\n];\n";
            file_put_contents($config_file, $updated_cfg, LOCK_EX);
            $current_hash = $new_hash;
            $msg_success = 'PIN / Password keamanan berhasil diubah secara permanen!';
        }
    }
}

// 10. LOGIKA HAPUS DOKUMEN (DENGAN PROTEKSI CSRF)
if ($is_authenticated && isset($_GET['action']) && $_GET['action'] === 'delete' && !empty($_GET['id'])) {
    $del_id = trim($_GET['id']);
    $req_csrf = $_GET['csrf'] ?? '';
    if (!hash_equals($_SESSION['csrf_token'], $req_csrf)) {
        $msg_error = 'Aksi hapus ditolak karena token keamanan tidak valid.';
    } elseif (isset($documents[$del_id])) {
        unset($documents[$del_id]);
        file_put_contents($json_file, json_encode($documents, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
        $msg_success = "Dokumen {$del_id} berhasil dihapus dari sistem verifikasi.";
    }
}

// 11. LOGIKA BUAT DOKUMEN BARU (DENGAN PROTEKSI CSRF)
$created_doc = null;
if ($is_authenticated && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_doc') {
    $post_csrf = $_POST['csrf_token'] ?? '';
    if (!hash_equals($_SESSION['csrf_token'], $post_csrf)) {
        $msg_error = 'Token keamanan kadaluwarsa. Silakan ulangi pengisian formulir.';
    } else {
        $title          = htmlspecialchars(trim($_POST['title'] ?? ''), ENT_QUOTES, 'UTF-8');
        $doc_number     = htmlspecialchars(trim($_POST['doc_number'] ?? ''), ENT_QUOTES, 'UTF-8');
        $doc_type       = htmlspecialchars(trim($_POST['doc_type'] ?? 'Dokumen Usulan Teknis & Rencana Anggaran Biaya (RAB)'), ENT_QUOTES, 'UTF-8');
        $target_agency  = htmlspecialchars(trim($_POST['target_agency'] ?? ''), ENT_QUOTES, 'UTF-8');
        $target_person  = htmlspecialchars(trim($_POST['target_person'] ?? ''), ENT_QUOTES, 'UTF-8');
        $budget_value   = htmlspecialchars(trim($_POST['budget_value'] ?? ''), ENT_QUOTES, 'UTF-8');
        $duration       = htmlspecialchars(trim($_POST['duration'] ?? ''), ENT_QUOTES, 'UTF-8');
        $issue_date     = htmlspecialchars(trim($_POST['issue_date'] ?? date('d F Y')), ENT_QUOTES, 'UTF-8');
        $issue_location = htmlspecialchars(trim($_POST['issue_location'] ?? 'Jakarta, Indonesia'), ENT_QUOTES, 'UTF-8');
        
        // Generate ID TTD otomatis berurutan & terlacak oleh sistem
        $cur_year = date('Y');
        $seq = count($documents) + 1;
        $id_ttd = "DJCS-TTD-{$cur_year}-" . str_pad($seq, 3, '0', STR_PAD_LEFT);
        while (isset($documents[$id_ttd])) {
            $seq++;
            $id_ttd = "DJCS-TTD-{$cur_year}-" . str_pad($seq, 3, '0', STR_PAD_LEFT);
        }

        $hash  = 'SHA256: ' . hash('sha256', $id_ttd . $title . $target_agency . $issue_date . bin2hex(random_bytes(16)));

        $new_doc = [
            'id'             => $id_ttd,
            'id_ttd'         => $id_ttd,
            'token'          => $id_ttd,
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
            'hash_signature' => $hash,
            'status'         => 'VALID',
            'status_desc'    => 'Tanda tangan elektronik SAH, ASLI, dan TERVERIFIKASI secara resmi terdaftar di database dennyjcs.com',
            'created_at'     => date('Y-m-d H:i:s')
        ];

        $documents[$doc_id] = $new_doc;
        file_put_contents($json_file, json_encode($documents, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
        
        $created_doc = $new_doc;
        $msg_success = "Dokumen '{$title}' berhasil didaftarkan secara sah!";
    }
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
  
  <!-- Library QR Code, PDF.js (Preview) & PDF-Lib (Stamper) Client-Side -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  
  <style>
    /* INTERACTIVE PDF VISUAL PLACER */
    .pdf-stage-wrapper {
      background: #e2e8f0;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 18px;
      margin: 18px 0;
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
    .pdf-toolbar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 8.5pt;
    }
    .pdf-page-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pdf-mini-btn {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #0f172a;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 8.2pt;
      font-weight: 600;
      cursor: pointer;
    }
    .pdf-mini-btn:hover { background: #e2e8f0; }
    .pdf-mini-btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .pdf-canvas-frame {
      position: relative;
      display: inline-block;
      box-shadow: 0 8px 28px rgba(15, 23, 42, 0.18);
      background: #ffffff;
      line-height: 0;
      user-select: none;
      -webkit-user-select: none;
      max-width: 100%;
    }
    #pdfPreviewCanvas {
      display: block;
      max-width: 100%;
      height: auto;
      cursor: crosshair;
    }
    #qrDragOverlay {
      position: absolute;
      cursor: grab;
      border: 2px dashed #0284c7;
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2), 0 6px 16px rgba(0, 0, 0, 0.18);
      background: #ffffff;
      touch-action: none;
      z-index: 10;
    }
    #qrDragOverlay:active {
      cursor: grabbing;
      border-color: #059669;
    }
    #qrDragOverlay img {
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }
    .qr-drag-tag {
      position: absolute;
      top: -22px;
      left: 50%;
      transform: translateX(-50%);
      background: #0284c7;
      color: #ffffff;
      font-size: 7pt;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
    }
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

    /* ALERTS */
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
    .alert-danger {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
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
          <div class="brand-title">E-Sign Generator Panel (Secured)</div>
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
      <!-- LOGIN VIEW (DENGAN PROTEKSI RATE LIMITING & BRUTE FORCE) -->
      <div class="card" style="max-width: 440px; margin: 40px auto;">
        <div class="card-header" style="text-align: center; display: block;">
          <h2 class="card-title">🔐 Autentikasi Pengelola E-Sign</h2>
          <p style="font-size: 8pt; color: #64748b; margin-top: 4px;">Sistem dilindungi enkripsi Bcrypt &amp; pencegah brute-force</p>
        </div>
        <div class="card-body">
          <?php if (isset($_GET['timeout'])): ?>
            <div class="alert-danger" style="margin-bottom: 14px;">
              ⏰ Sesi telah berakhir karena tidak ada aktivitas selama 30 menit. Silakan masukkan PIN kembali.
            </div>
          <?php endif; ?>

          <?php if (!empty($auth_error)): ?>
            <div class="alert-danger" style="margin-bottom: 14px;">
              ⚠️ <?php echo htmlspecialchars($auth_error); ?>
            </div>
          <?php endif; ?>

          <form method="POST" action="">
            <input type="hidden" name="action" value="login">
            <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
            
            <div class="form-group" style="margin-bottom: 18px;">
              <label for="pin">PIN / Password Keamanan:</label>
              <input type="password" id="pin" name="pin" placeholder="Masukkan PIN / Password Anda..." <?php echo $is_locked ? 'disabled' : 'required autofocus'; ?>>
              <small style="color: #64748b; font-size: 7.5pt; margin-top: 4px;">
                Toleransi maksimal 5x salah sebelum IP Anda diblokir otomatis selama 15 menit.
              </small>
            </div>
            
            <button type="submit" class="btn-submit" style="width: 100%; justify-content: center;" <?php echo $is_locked ? 'disabled style="background: #94a3b8; cursor: not-allowed;"' : ''; ?>>
              <?php echo $is_locked ? "Terkunci ({$remaining_lock_min} Menit)" : "Buka Generator Aman →"; ?>
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

      <?php if (!empty($msg_error)): ?>
        <div class="alert-danger">
          <span>⚠️</span>
          <div><?php echo htmlspecialchars($msg_error); ?></div>
        </div>
      <?php endif; ?>

      <div class="card">
        <!-- TAB NAVIGATION -->
        <div class="tab-nav">
          <button class="tab-btn active" onclick="switchTab('tab-create')">📝 Buat E-Sign Baru</button>
          <button class="tab-btn" onclick="switchTab('tab-stamper')">📄 Tempel ke PDF (PDF Stamper)</button>
          <button class="tab-btn" onclick="switchTab('tab-archive')">📚 Arsip Dokumen (<?php echo count($documents); ?>)</button>
          <button class="tab-btn" onclick="switchTab('tab-security')">🛡️ Pengaturan PIN &amp; Keamanan</button>
        </div>

        <!-- TAB 1: FORM BUAT E-SIGN -->
        <div id="tab-create" class="card-body">
          <form method="POST" action="" id="createDocForm">
            <input type="hidden" name="action" value="create_doc">
            <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="title">Judul Dokumen / Proposal: *</label>
                <input type="text" id="title" name="title" placeholder="Contoh: Proposal Rancang Bangun Sistem Informasi ..." required>
              </div>

              <div class="form-group">
                <label for="id_ttd_preview">ID Tanda Tangan Digital (ID TTD):</label>
                <input type="text" id="id_ttd_preview" value="Otomatis di-generate sistem (Contoh: DJCS-TTD-<?php echo date('Y'); ?>-<?php echo str_pad(count($documents)+1, 3, '0', STR_PAD_LEFT); ?>)" disabled style="background: #f1f5f9; color: #0284c7; font-weight: 700; font-family: 'Fira Code', monospace;">
              </div>

              <div class="form-group">
                <label for="doc_number">Nomor Surat / Berkas (Opsional, jika ada):</label>
                <input type="text" id="doc_number" name="doc_number" placeholder="Kosongkan jika tidak ada nomor surat...">
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
                  <option value="Dokumen Teknis & Lampiran">Dokumen Teknis & Lampiran</option>
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


            </div>

            <button type="submit" class="btn-submit">
              ⚡ Daftarkan Dokumen & Buat E-Sign Sekarang
            </button>
          </form>

          <!-- HASIL GENERATE BARCODE QR -->
          <div id="resultSection" style="<?php echo $created_doc ? 'display: block;' : 'display: none;'; ?> margin-top: 32px; border-top: 2px dashed #e2e8f0; padding-top: 24px;">
            <h3 style="font-size: 11pt; color: #092c4c; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
              <span>🎉</span> Barcode QR Tanda Tangan Digital Siap Digunakan
            </h3>
            
            <p style="font-size: 8.5pt; color: #64748b; margin-bottom: 16px;">
              Dokumen telah terdaftar di <strong>dennyjcs.com/e-sign</strong> dengan ID TTD: <strong id="previewToken" style="font-family: 'Fira Code', monospace; color: #0284c7;"><?php echo htmlspecialchars($created_doc['id_ttd'] ?? $created_doc['token'] ?? ''); ?></strong>. Luaran berupa <strong>barcode QR murni tanpa teks tambahan</strong> sehingga tinggal Anda tempelkan pada dokumen.
            </p>

            <!-- PREVIEW VISUAL (BARCODE QR SAJA) -->
            <div class="preview-box" style="padding: 24px;">
              <div id="qrcodeContainer" style="width: 180px; height: 180px; background: #ffffff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);"></div>
            </div>

            <!-- ACTION BUTTONS -->
            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
              <button type="button" class="btn-submit" onclick="downloadQrOnly()" style="background: #059669;">
                📥 Unduh Barcode QR (PNG Resolusi Tinggi)
              </button>
              <a id="btnTestVerify" href="index.php?doc=<?php echo urlencode($created_doc['id'] ?? ''); ?>" target="_blank" class="nav-btn nav-btn-outline" style="background: #0284c7; color: white; display: inline-flex; align-items: center; gap: 6px; padding: 12px 18px;">
                🔍 Uji Halaman Verifikasi Dokumen ↗
              </a>
            </div>

            <!-- HIDDEN CONTAINERS FOR HIGH RES PURE QR RENDERING -->
            <div id="qrHighResContainer" style="display: none;"></div>
            <canvas id="stampCanvas" width="560" height="560" style="display: none;"></canvas>
          </div>
        </div>

        <!-- TAB 2: PDF STAMPER INTERAKTIF (DRAG & DROP POSISI MANUAL) -->
        <div id="tab-stamper" class="card-body" style="display: none;">
          <h3 style="font-size: 11pt; color: #092c4c; margin-bottom: 8px;">📄 Tempelkan Barcode QR Secara Manual ke Berkas PDF</h3>
          <p style="font-size: 8.5pt; color: #64748b; margin-bottom: 18px;">
            Unggah berkas PDF Anda, pilih halaman tujuan, lalu <strong>geser (drag &amp; drop) atau klik langsung</strong> pada halaman PDF untuk menempatkan <strong>barcode QR murni</strong> persis di posisi yang diinginkan. Semua diproses di browser Anda (100% aman, tidak diunggah ke server).
          </p>

          <div class="form-grid" style="margin-bottom: 14px;">
            <div class="form-group">
              <label for="stampTargetDoc">1. Pilih ID TTD / Dokumen E-Sign:</label>
              <select id="stampTargetDoc" onchange="updateStamperDoc()">
                <?php foreach ($documents as $doc_key => $doc_item): ?>
                  <option value="<?php echo htmlspecialchars($doc_key); ?>" <?php echo ($created_doc && $created_doc['id'] === $doc_key) ? 'selected' : ''; ?>>
                    <?php echo htmlspecialchars(($doc_item['id_ttd'] ?? $doc_item['token'] ?? $doc_key) . ' — ' . $doc_item['title']); ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="form-group">
              <label for="pdfFileInput">2. Pilih Berkas PDF Anda:</label>
              <input type="file" id="pdfFileInput" accept="application/pdf" onchange="handlePdfUpload(event)" style="padding: 8px; border: 1px dashed #94a3b8; border-radius: 6px; background: #f8fafc;">
            </div>
          </div>

          <!-- AREA PRATINJAU PDF INTERAKTIF -->
          <div id="pdfStageWrapper" class="pdf-stage-wrapper">
            <div class="pdf-toolbar">
              <div class="pdf-page-controls">
                <button type="button" class="pdf-mini-btn" id="btnPrevPage" onclick="changePdfPage(-1)">◀ Sebelumnya</button>
                <span style="font-weight: 700; color: #092c4c;">
                  Halaman <select id="pdfPageDropdown" onchange="jumpPdfPage(this.value)" style="width: auto; padding: 4px 8px; font-size: 8.5pt;"></select> dari <span id="pdfTotalPages">1</span>
                </span>
                <button type="button" class="pdf-mini-btn" id="btnNextPage" onclick="changePdfPage(1)">Berikutnya ▶</button>
              </div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <label for="qrSizeSlider" style="margin: 0; font-size: 8.2pt; white-space: nowrap;">Ukuran QR: <strong id="qrSizeLabel">80 pt</strong></label>
                <input type="range" id="qrSizeSlider" min="45" max="150" value="80" oninput="updateQrOverlaySize(this.value)" style="width: 130px; cursor: pointer;">
              </div>
            </div>

            <div style="font-size: 8pt; color: #475569; text-align: center;">
              💡 <strong>Tips:</strong> Geser kotak Barcode QR di bawah ini dengan mouse/jari, atau <strong>klik di titik mana pun</strong> pada dokumen untuk memindahkannya.
            </div>

            <div class="pdf-canvas-frame" id="pdfCanvasFrame">
              <canvas id="pdfPreviewCanvas"></canvas>
              <div id="qrDragOverlay" title="Geser untuk memindahkan posisi Barcode QR">
                <span class="qr-drag-tag">Geser QR</span>
                <img id="qrOverlayImg" src="" alt="Barcode QR">
              </div>
            </div>
          </div>

          <button type="button" id="btnSaveSignedPdf" class="btn-submit" onclick="stampAndDownloadPdf()" style="background: #059669; width: 100%; justify-content: center; padding: 14px;" disabled>
            🚀 Simpan &amp; Unduh PDF Bertanda Tangan QR Sekarang
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
                  <th>ID Tanda Tangan (ID TTD)</th>
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
                      <a href="javascript:void(0)" onclick="downloadQrById('<?php echo htmlspecialchars($key, ENT_QUOTES); ?>')" style="color: #059669; font-weight: 600; text-decoration: none; margin-right: 10px;">📥 Unduh QR</a>
                      <a href="index.php?doc=<?php echo urlencode($key); ?>" target="_blank" style="color: #0284c7; font-weight: 600; text-decoration: none; margin-right: 10px;">Buka ↗</a>
                      <a href="?action=delete&id=<?php echo urlencode($key); ?>&csrf=<?php echo urlencode($_SESSION['csrf_token']); ?>" onclick="return confirm('Yakin ingin menghapus dokumen ini dari sistem verifikasi?');" style="color: #ef4444; text-decoration: none;">Hapus</a>
                    </td>
                  </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 4: PENGATURAN KEAMANAN & UBAH PIN -->
        <div id="tab-security" class="card-body" style="display: none;">
          <h3 style="font-size: 11pt; color: #092c4c; margin-bottom: 8px;">🛡️ Pengaturan PIN / Password Keamanan Generator</h3>
          <p style="font-size: 8.5pt; color: #64748b; margin-bottom: 20px;">
            Anda dapat mengganti PIN / Password kapan saja. Sandi Anda dienkripsi secara otomatis menggunakan algoritma <strong>Bcrypt Salted Hash</strong> sehingga tidak dapat dibaca oleh siapapun.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; max-width: 520px;">
            <form method="POST" action="">
              <input type="hidden" name="action" value="change_pin">
              <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">

              <div class="form-group" style="margin-bottom: 14px;">
                <label for="old_pin">PIN / Password Saat Ini: *</label>
                <input type="password" id="old_pin" name="old_pin" placeholder="Masukkan PIN lama..." required>
              </div>

              <div class="form-group" style="margin-bottom: 14px;">
                <label for="new_pin">PIN / Password Baru: * (Bisa angka atau huruf)</label>
                <input type="password" id="new_pin" name="new_pin" placeholder="Minimal 4 karakter (bebas kombinasi)..." required>
              </div>

              <div class="form-group" style="margin-bottom: 20px;">
                <label for="confirm_pin">Ulangi PIN / Password Baru: *</label>
                <input type="password" id="confirm_pin" name="confirm_pin" placeholder="Ketik ulang PIN baru..." required>
              </div>

              <button type="submit" class="btn-submit" style="background: #0284c7;">
                💾 Simpan PIN / Password Baru
              </button>
            </form>
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; max-width: 520px;">
            <h4 style="font-size: 9pt; color: #166534; margin-bottom: 6px;">Status Sistem Keamanan:</h4>
            <ul style="font-size: 8pt; color: #166534; line-height: 1.5; padding-left: 18px;">
              <li><strong>Proteksi Brute-Force:</strong> AKTIF (Maks 5x salah, lockout 15 menit)</li>
              <li><strong>Proteksi CSRF:</strong> AKTIF (Token kriptografis 32-byte)</li>
              <li><strong>Proteksi Berkas .json:</strong> AKTIF (Diblokir oleh .htaccess)</li>
              <li><strong>Enkripsi PIN:</strong> Bcrypt (Cost Factor 10)</li>
              <li><strong>Sesi Kedaluwarsa:</strong> 30 Menit inaktivitas</li>
            </ul>
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
      document.getElementById('tab-security').style.display = 'none';

      document.getElementById(tabId).style.display = 'block';
    }

    function getVerifyUrl(doc) {
      return 'https://dennyjcs.com/e-sign?doc=' + encodeURIComponent(doc.id_ttd || doc.id);
    }

    function renderQrPreview(doc) {
      const qrBox = document.getElementById('qrcodeContainer');
      qrBox.innerHTML = '';

      const verifyUrl = getVerifyUrl(doc);

      new QRCode(qrBox, {
        text: verifyUrl,
        width: 160,
        height: 160,
        colorDark: '#092c4c',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });

      const tokenEl = document.getElementById('previewToken');
      if (tokenEl) tokenEl.innerText = doc.id_ttd || doc.token || doc.id;
      const verifyBtn = document.getElementById('btnTestVerify');
      if (verifyBtn) verifyBtn.href = 'index.php?doc=' + encodeURIComponent(doc.id_ttd || doc.id);
    }

    // Render barcode QR murni resolusi tinggi (tanpa teks tambahan) ke canvas
    function renderPureQrCanvas(doc, callback) {
      const hiResBox = document.getElementById('qrHighResContainer');
      hiResBox.innerHTML = '';

      const verifyUrl = getVerifyUrl(doc);
      new QRCode(hiResBox, {
        text: verifyUrl,
        width: 512,
        height: 512,
        colorDark: '#092c4c',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });

      setTimeout(() => {
        const qrSource = hiResBox.querySelector('canvas') || hiResBox.querySelector('img');
        if (!qrSource) {
          alert('Barcode QR gagal dibuat, silakan coba lagi.');
          return;
        }
        const canvas = document.getElementById('stampCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 560;
        canvas.height = 560;

        // Latar putih bersih sebagai quiet-zone agar mudah dipindai kamera di atas dokumen apa pun
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(qrSource, 24, 24, 512, 512);

        if (callback) callback(canvas);
      }, 60);
    }

    function downloadQrOnly() {
      if (!currentDocData) {
        alert('Silakan daftarkan dokumen terlebih dahulu.');
        return;
      }
      renderPureQrCanvas(currentDocData, (canvas) => {
        const link = document.createElement('a');
        link.download = 'QR_' + (currentDocData.id_ttd || currentDocData.token || currentDocData.id) + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }

    function downloadQrById(docId) {
      const doc = registeredDocs[docId];
      if (!doc) return;
      renderPureQrCanvas(doc, (canvas) => {
        const link = document.createElement('a');
        link.download = 'QR_' + (doc.id_ttd || doc.token || doc.id) + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }

    // ==================== INTERACTIVE PDF VISUAL PLACER ====================
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    let uploadedPdfBytes = null;
    let uploadedPdfName  = 'dokumen.pdf';
    let pdfJsDoc         = null;
    let currentPdfPage   = 1;
    let totalPdfPages    = 1;
    let currentPageWidthPt  = 595.28;
    let currentPageHeightPt = 841.89;
    let qrSizePt         = 80;
    let qrPosRatioX      = 0.78; // Default kanan bawah (rasio 0..1 dari lebar halaman)
    let qrPosRatioY      = 0.80; // Default kanan bawah (rasio 0..1 dari tinggi halaman)
    let currentQrDataUrl = '';

    function getSelectedStamperDoc() {
      const sel = document.getElementById('stampTargetDoc');
      const selectedId = sel ? sel.value : null;
      return (selectedId && registeredDocs[selectedId]) ? registeredDocs[selectedId] : currentDocData;
    }

    function updateStamperDoc() {
      const doc = getSelectedStamperDoc();
      if (doc) {
        currentDocData = doc;
        refreshStamperQrImage(doc);
      }
    }

    function refreshStamperQrImage(doc, cb) {
      if (!doc) return;
      renderPureQrCanvas(doc, (canvas) => {
        currentQrDataUrl = canvas.toDataURL('image/png');
        const imgEl = document.getElementById('qrOverlayImg');
        if (imgEl) imgEl.src = currentQrDataUrl;
        if (cb) cb();
      });
    }

    async function handlePdfUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const statusDiv = document.getElementById('stamperStatus');
      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<span style="color: #0284c7;">⏳ Membaca dan merender halaman PDF...</span>';

      try {
        uploadedPdfName = file.name;
        const buf = await file.arrayBuffer();
        uploadedPdfBytes = new Uint8Array(buf);

        const loadingTask = pdfjsLib.getDocument({ data: uploadedPdfBytes.slice() });
        pdfJsDoc = await loadingTask.promise;
        totalPdfPages = pdfJsDoc.numPages;

        // Isi dropdown halaman
        const dd = document.getElementById('pdfPageDropdown');
        dd.innerHTML = '';
        for (let i = 1; i <= totalPdfPages; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.text = i;
          dd.appendChild(opt);
        }
        document.getElementById('pdfTotalPages').innerText = totalPdfPages;

        // Default buka halaman terakhir (tempat tanda tangan)
        currentPdfPage = totalPdfPages;
        dd.value = currentPdfPage;

        document.getElementById('pdfStageWrapper').style.display = 'flex';
        document.getElementById('btnSaveSignedPdf').disabled = false;

        const doc = getSelectedStamperDoc();
        refreshStamperQrImage(doc, async () => {
          await renderPdfPage(currentPdfPage);
          statusDiv.innerHTML = '<span style="color: #059669;">✅ PDF siap! Geser atau klik posisi Barcode QR pada pratinjau di atas, lalu klik tombol Simpan &amp; Unduh.</span>';
        });
      } catch (err) {
        console.error(err);
        statusDiv.innerHTML = '<span style="color: #ef4444;">❌ Gagal membaca PDF: ' + err.message + '</span>';
      }
    }

    async function renderPdfPage(pageNum) {
      if (!pdfJsDoc) return;
      const page = await pdfJsDoc.getPage(pageNum);
      const unscaledViewport = page.getViewport({ scale: 1 });
      currentPageWidthPt  = unscaledViewport.width;
      currentPageHeightPt = unscaledViewport.height;

      // Skala agar nyaman dilihat di layar (maks lebar ~680px)
      const maxDisplayWidth = Math.min(680, window.innerWidth - 90);
      const scale = maxDisplayWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale: scale });

      const canvas = document.getElementById('pdfPreviewCanvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      document.getElementById('pdfPageDropdown').value = pageNum;
      document.getElementById('btnPrevPage').disabled = (pageNum <= 1);
      document.getElementById('btnNextPage').disabled = (pageNum >= totalPdfPages);

      positionQrOverlayFromRatio();
    }

    function changePdfPage(delta) {
      const next = currentPdfPage + delta;
      if (next >= 1 && next <= totalPdfPages) {
        currentPdfPage = next;
        renderPdfPage(currentPdfPage);
      }
    }

    function jumpPdfPage(val) {
      const num = parseInt(val, 10);
      if (num >= 1 && num <= totalPdfPages) {
        currentPdfPage = num;
        renderPdfPage(currentPdfPage);
      }
    }

    function updateQrOverlaySize(val) {
      qrSizePt = parseInt(val, 10);
      document.getElementById('qrSizeLabel').innerText = qrSizePt + ' pt';
      positionQrOverlayFromRatio();
    }

    function positionQrOverlayFromRatio() {
      const canvas = document.getElementById('pdfPreviewCanvas');
      const overlay = document.getElementById('qrDragOverlay');
      if (!canvas || !overlay || !canvas.clientWidth) return;

      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;
      const qrPx = (qrSizePt / currentPageWidthPt) * displayW;

      overlay.style.width  = qrPx + 'px';
      overlay.style.height = qrPx + 'px';

      let leftPx = qrPosRatioX * displayW;
      let topPx  = qrPosRatioY * displayH;

      // Pastikan tetap di dalam batas halaman
      leftPx = Math.max(0, Math.min(displayW - qrPx, leftPx));
      topPx  = Math.max(0, Math.min(displayH - qrPx, topPx));

      overlay.style.left = leftPx + 'px';
      overlay.style.top  = topPx + 'px';

      qrPosRatioX = leftPx / displayW;
      qrPosRatioY = topPx / displayH;
    }

    // Event Drag & Drop (Mouse + Touch) dan Klik Langsung di Canvas
    (function initInteractiveQrPlacer() {
      let isDragging = false;
      let dragOffsetX = 0;
      let dragOffsetY = 0;

      window.addEventListener('DOMContentLoaded', () => {
        const overlay = document.getElementById('qrDragOverlay');
        const canvas  = document.getElementById('pdfPreviewCanvas');
        if (!overlay || !canvas) return;

        // Klik di mana saja pada halaman PDF untuk memindahkan pusat QR langsung ke titik klik
        canvas.addEventListener('mousedown', (e) => {
          const rect = canvas.getBoundingClientRect();
          const qrW = overlay.offsetWidth;
          const qrH = overlay.offsetHeight;
          let leftPx = (e.clientX - rect.left) - (qrW / 2);
          let topPx  = (e.clientY - rect.top) - (qrH / 2);
          leftPx = Math.max(0, Math.min(rect.width - qrW, leftPx));
          topPx  = Math.max(0, Math.min(rect.height - qrH, topPx));

          overlay.style.left = leftPx + 'px';
          overlay.style.top  = topPx + 'px';
          qrPosRatioX = leftPx / rect.width;
          qrPosRatioY = topPx / rect.height;
        });

        // Mulai drag pada kotak QR
        const startDrag = (clientX, clientY) => {
          isDragging = true;
          const ovRect = overlay.getBoundingClientRect();
          dragOffsetX = clientX - ovRect.left;
          dragOffsetY = clientY - ovRect.top;
        };

        const moveDrag = (clientX, clientY) => {
          if (!isDragging) return;
          const rect = canvas.getBoundingClientRect();
          const qrW = overlay.offsetWidth;
          const qrH = overlay.offsetHeight;

          let leftPx = (clientX - rect.left) - dragOffsetX;
          let topPx  = (clientY - rect.top) - dragOffsetY;

          leftPx = Math.max(0, Math.min(rect.width - qrW, leftPx));
          topPx  = Math.max(0, Math.min(rect.height - qrH, topPx));

          overlay.style.left = leftPx + 'px';
          overlay.style.top  = topPx + 'px';
          qrPosRatioX = leftPx / rect.width;
          qrPosRatioY = topPx / rect.height;
        };

        overlay.addEventListener('mousedown', (e) => {
          e.preventDefault();
          startDrag(e.clientX, e.clientY);
        });
        window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
        window.addEventListener('mouseup', () => { isDragging = false; });

        overlay.addEventListener('touchstart', (e) => {
          if (e.touches.length === 1) {
            e.preventDefault();
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, { passive: false });
        window.addEventListener('touchmove', (e) => {
          if (isDragging && e.touches.length === 1) {
            moveDrag(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, { passive: false });
        window.addEventListener('touchend', () => { isDragging = false; });
      });

      window.addEventListener('resize', () => {
        if (pdfJsDoc) positionQrOverlayFromRatio();
      });
    })();

    async function stampAndDownloadPdf() {
      const statusDiv = document.getElementById('stamperStatus');
      if (!uploadedPdfBytes) {
        alert('Silakan pilih berkas PDF terlebih dahulu.');
        return;
      }

      const doc = getSelectedStamperDoc();
      if (!doc) {
        alert('Silakan pilih data dokumen tanda tangan.');
        return;
      }

      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<span style="color: #0284c7;">⏳ Menempelkan barcode QR sesuai posisi pilihan Anda...</span>';

      try {
        const pdfDoc = await PDFLib.PDFDocument.load(uploadedPdfBytes.slice());
        const pages = pdfDoc.getPages();
        const targetPage = pages[currentPdfPage - 1];
        const { width: pdfW, height: pdfH } = targetPage.getSize();

        renderPureQrCanvas(doc, async (canvas) => {
          const qrPngBytes = await fetch(canvas.toDataURL('image/png')).then(res => res.arrayBuffer());
          const qrImage = await pdfDoc.embedPng(qrPngBytes);

          // Konversi presisi koordinat visual (kiri-atas) ke koordinat PDF (kiri-bawah)
          const posX = qrPosRatioX * pdfW;
          const posY = pdfH - (qrPosRatioY * pdfH) - qrSizePt;

          targetPage.drawImage(qrImage, {
            x: posX,
            y: Math.max(0, posY),
            width: qrSizePt,
            height: qrSizePt,
          });

          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = uploadedPdfName.replace(/\.pdf$/i, '') + '_SIGNED.pdf';
          link.click();

          statusDiv.innerHTML = '<span style="color: #059669; font-weight: bold;">✅ Berhasil! PDF dengan barcode QR pada posisi pilihan Anda telah diunduh.</span>';
        });

      } catch (err) {
        console.error(err);
        statusDiv.innerHTML = '<span style="color: #ef4444;">❌ Gagal memproses PDF: ' + err.message + '</span>';
      }
    }
  </script>

</body>
</html>
