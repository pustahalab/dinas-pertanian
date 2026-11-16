const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

async function buildOnePageSurat() {
  const verifyUrl = 'https://dennyjcs.com/e-sign?doc=SURAT-KARTANI-BIAK-2026&signer=Ir.+Denny+Jean+Cross+Sihombing,+S.T.,+M.T.&issued=2026-11-16';

  const qrDataUrl = await qrcode.toDataURL(verifyUrl, {
    margin: 1,
    width: 140,
    color: {
      dark: '#092c4c',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  });

  const suratHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Surat Pengajuan Proposal SIM-KARTANI - Kadis Pertanian Biak Numfor</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Fira+Code:wght@400;500&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 16mm 10mm 18mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Lora', Georgia, serif;
      font-size: 8.5pt;
      line-height: 1.35;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #f1f5f9;
    }

    .sheet {
      background: white;
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      margin: 10px auto;
      padding: 12mm 18mm 12mm 20mm;
      box-sizing: border-box;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    @media print {
      body { background: white; }
      .sheet {
        margin: 0;
        box-shadow: none;
        width: 100%;
        height: 100%;
        max-height: 100%;
        padding: 0;
      }
      .no-print { display: none !important; }
    }

    /* KOP SURAT PROFESIONAL MODERN */
    .kop-container {
      border-bottom: 2px solid #092c4c;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }

    .kop-container::after {
      content: "";
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 1px;
      background: #0284c7;
    }

    .kop-logo {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #092c4c, #0284c7);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 13pt;
      box-shadow: 0 3px 8px rgba(9, 44, 76, 0.25);
      flex-shrink: 0;
    }

    .kop-text h1 {
      margin: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11.5pt;
      font-weight: 800;
      color: #092c4c;
      letter-spacing: 0.2px;
      line-height: 1.2;
    }

    .kop-text h2 {
      margin: 1px 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8pt;
      font-weight: 600;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .kop-text p {
      margin: 1px 0 0 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 7.5pt;
      color: #475569;
      line-height: 1.25;
    }

    /* METADATA SURAT */
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8pt;
    }

    .meta-table td {
      vertical-align: top;
      padding: 1px 0;
    }

    /* RECIPIENT BLOCK */
    .recipient-box {
      margin: 6px 0 8px 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8.5pt;
      line-height: 1.3;
      background: #f8fafc;
      border-left: 3px solid #0284c7;
      padding: 6px 12px;
      border-radius: 0 4px 4px 0;
    }

    .recipient-box strong {
      color: #092c4c;
    }

    /* ISI SURAT */
    .letter-body p {
      text-align: justify;
      text-indent: 22px;
      margin: 4px 0;
      line-height: 1.35;
    }

    .highlight-banner {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 3px solid #16a34a;
      padding: 6px 12px;
      margin: 5px 0 5px 22px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      font-size: 8pt;
      color: #14532d;
      border-radius: 0 4px 4px 0;
      line-height: 1.3;
    }

    .feature-list {
      margin: 3px 0 5px 22px;
      padding-left: 14px;
      font-size: 8pt;
      line-height: 1.32;
    }

    .feature-list li {
      margin-bottom: 2px;
      text-align: justify;
    }

    .feature-list strong {
      color: #092c4c;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* BLOK TANDA TANGAN DIGITAL */
    .signature-section {
      margin-top: 8px;
      display: flex;
      justify-content: flex-end;
    }

    .signature-card {
      width: 320px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 7.5pt;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }

    .esign-badge-box {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 4px 0 6px 0;
      padding: 4px 6px;
      background: #f8fafc;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .qr-img {
      width: 60px;
      height: 60px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: white;
      padding: 2px;
      display: block;
      flex-shrink: 0;
    }

    .esign-meta {
      font-size: 6.8pt;
      color: #475569;
      line-height: 1.25;
    }

    .esign-meta strong {
      color: #092c4c;
      font-size: 7.2pt;
      display: block;
      letter-spacing: 0.2px;
    }

    .signer-name {
      font-size: 8.5pt;
      font-weight: 800;
      color: #092c4c;
      border-bottom: 1.2px solid #092c4c;
      display: inline-block;
      margin-top: 2px;
      margin-bottom: 1px;
    }

    /* TEMBUSAN */
    .tembusan-box {
      margin-top: 8px;
      padding-top: 5px;
      border-top: 1px dashed #cbd5e1;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 7pt;
      color: #475569;
      line-height: 1.25;
    }

    .tembusan-box strong {
      color: #092c4c;
    }

    .print-button {
      position: fixed;
      top: 20px;
      right: 25px;
      background: #0284c7;
      color: white;
      border: none;
      padding: 8px 16px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 9pt;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(2, 132, 199, 0.35);
      z-index: 9999;
    }

    .print-button:hover { background: #0369a1; }
  </style>
</head>
<body>

  <button class="print-button no-print" onclick="window.print()">🖨️ Cetak Surat (PDF / Print)</button>

  <div class="sheet">
    <div>
      <!-- KOP RESMI PENGEMBANG -->
      <div class="kop-container">
        <div class="kop-logo">DJ</div>
        <div class="kop-text">
          <h1>Ir. DENNY JEAN CROSS SIHOMBING, S.T., M.T.</h1>
          <h2>Konsultan Rekayasa Perangkat Lunak & Pengembang Sistem Informasi</h2>
          <p>Dosen Program Studi Sistem Informasi &bull; Universitas Katolik Indonesia Atma Jaya Jakarta</p>
          <p>Laman Web: <strong>dennyjcs.com</strong> &bull; Pos-el: <strong>denny.jean@atmajaya.ac.id</strong> &bull; Jakarta, Indonesia</p>
        </div>
      </div>

      <!-- METADATA SURAT -->
      <table class="meta-table">
        <tr>
          <td style="width: 14%;">Nomor</td>
          <td style="width: 2%;">:</td>
          <td style="width: 48%;">012/EXT-PROP/DJCS/XI/2026</td>
          <td style="width: 36%; text-align: right;">Jakarta, 16 November 2026</td>
        </tr>
        <tr>
          <td>Lampiran</td>
          <td>:</td>
          <td colspan="2">1 (satu) Berkas Proposal Lengkap & Rencana Anggaran Biaya (RAB)</td>
        </tr>
        <tr>
          <td>Hal</td>
          <td>:</td>
          <td colspan="2"><strong style="color: #092c4c;">Pengajuan Proposal Rancang Bangun Sistem Informasi Manajemen Kartu Tani OAP (SIM-KARTANI) Terintegrasi QR Scanner DAMRI</strong></td>
        </tr>
      </table>

      <!-- TUJUAN SURAT -->
      <div class="recipient-box">
        Kepada Yth.<br>
        <strong>drh. BAMBANG HAYANTO</strong><br>
        Plt. Kepala Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor, Provinsi Papua<br>
        di - <strong>BIAK</strong>
      </div>

      <!-- ISI SURAT -->
      <div class="letter-body">
        <p>Dengan hormat,</p>
        <p>
          Semoga Bapak beserta seluruh jajaran di lingkungan Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor senantiasa dilimpahkan kesehatan, kekuatan, dan kesuksesan dalam memimpin penyelenggaraan pembangunan sektor pertanian demi terwujudnya kemakmuran masyarakat di Kabupaten Biak Numfor, Provinsi Papua.
        </p>
        <p>
          Perkenalkan, saya <strong>Ir. Denny Jean Cross Sihombing, S.T., M.T.</strong>, seorang praktisi pengembang sistem informasi dan arsitek perangkat lunak, yang saat ini juga aktif bertugas sebagai Dosen pada Program Studi Sistem Informasi di Universitas Katolik Indonesia Atma Jaya Jakarta. Bertindak atas kapasitas profesional independen sebagai pengembang sistem dan konsultan teknologi informasi, perkenankan saya mengajukan proposal teknis pekerjaan:
        </p>

        <div class="highlight-banner">
          &ldquo;Rancang Bangun dan Implementasi Sistem Informasi Manajemen Kartu Tani Orang Asli Papua (SIM-KARTANI) Berbasis Web Terintegrasi QR Code Scanner Logistik DAMRI di Kabupaten Biak Numfor, Provinsi Papua&rdquo;
        </div>

        <p>
          Pengembangan sistem ini dirancang secara khusus untuk menjawab kebutuhan modernisasi digital data penerima manfaat program Otonomi Khusus (Otsus) serta memfasilitasi kelancaran distribusi logistik hasil panen bersama armada perintis DAMRI secara efisien, akuntabel, dan murni berbasis aplikasi digital (<em>paperless & digital-native</em>), dengan keunggulan pokok:
        </p>

        <ul class="feature-list">
          <li><strong>Digitalisasi Basis Data Terpadu:</strong> Manajemen terpusat untuk 500+ petani OAP di 10 Distrik dan 47 Kampung secara akurat, mutakhir, dan terlindungi hak aksesnya.</li>
          <li><strong>Identitas Digital Ber-QR Code Dinamis:</strong> Penerbitan Kartu Tani Digital yang aman tanpa memerlukan anggaran pengadaan kartu fisik PVC maupun mesin cetak berbiaya tinggi.</li>
          <li><strong>Validasi Realtime Logistik DAMRI:</strong> Pemanfaatan modul kamera smartphone petugas DAMRI untuk verifikasi hak subsidi angkut dan pencatatan muatan hasil panen menuju pasar sentral secara langsung.</li>
          <li><strong>Dashboard Eksekutif & Akuntabilitas Otsus:</strong> Visualisasi sebaran panen, kuota bantuan, dan jejak audit (<em>audit trail</em>) yang transparan bagi Pimpinan Daerah.</li>
        </ul>

        <p>
          Pekerjaan sistem ini dirancang terlaksana secara optimal dan tuntas selama <strong>4 (empat) bulan kalender</strong>. Bersama surat ini, saya lampirkan dokumen proposal teknis dan Rencana Anggaran Biaya (RAB) penyesuaian 4 bulan dengan total usulan investasi sebesar <strong>Rp 247.450.000,- (Dua Ratus Empat Puluh Tujuh Juta Empat Ratus Lima Puluh Ribu Rupiah)</strong>.
        </p>
        <p>
          Besar harapan saya usulan kerjasama ini dapat diterima dengan baik oleh Bapak Plt. Kepala Dinas. Saya menyatakan kesiapan penuh untuk mempresentasikan sistem serta mendiskusikan mekanisme implementasinya lebih lanjut baik secara daring maupun luring di Biak Numfor. Portofolio serta profil profesional saya dapat diakses melalui laman resmi <strong>dennyjcs.com</strong>.
        </p>
        <p>
          Demikian permohonan ini saya sampaikan. Atas perhatian, perkenan, dan kerjasama strategis dari Bapak Plt. Kepala Dinas, saya haturkan terima kasih yang sebesar-besarnya.
        </p>
      </div>

      <!-- BLOK TANDA TANGAN ELEKTRONIK -->
      <div class="signature-section">
        <div class="signature-card">
          <div>Hormat saya,</div>
          <div style="font-weight: 700; color: #092c4c; margin-bottom: 2px;">Pengusul & Pengembang Sistem,</div>
          
          <div class="esign-badge-box">
            <a href="${verifyUrl}" target="_blank" title="Klik untuk memverifikasi tanda tangan digital">
              <img src="${qrDataUrl}" alt="QR Tanda Tangan Digital" class="qr-img" />
            </a>
            <div class="esign-meta">
              <strong>DITANDATANGANI ELEKTRONIK</strong>
              Token: <span style="font-family: monospace; color: #0284c7; font-weight: bold;">DJCS-ESIGN-BIAK-2026</span><br>
              Verifikasi keaslian via browser:<br>
              <a href="https://dennyjcs.com/e-sign" target="_blank" style="color: #0284c7; text-decoration: none; font-weight: 700;">dennyjcs.com/e-sign</a><br>
              Waktu: 16 November 2026
            </div>
          </div>

          <div class="signer-name">Ir. Denny Jean Cross Sihombing, S.T., M.T.</div>
          <div style="color: #475569; font-size: 7.2pt; line-height: 1.25;">
            Pengembang Sistem Informasi &bull; Arsitek Perangkat Lunak<br>
            <em>Dosen Program Studi Sistem Informasi, Unika Atma Jaya Jakarta</em>
          </div>
        </div>
      </div>
    </div>

    <!-- TEMBUSAN DI BAGIAN BAWAH -->
    <div class="tembusan-box">
      <strong>Tembusan Yth:</strong><br>
      1. Bupati Biak Numfor (sebagai laporan) &bull; 2. Sekretaris Daerah Kabupaten Biak Numfor &bull; 3. Kepala Bidang Prasarana, Sarana, dan Penyuluhan Dinas Pertanian Biak Numfor &bull; 4. Arsip / Pertinggal
    </div>
  </div>

</body>
</html>
`;

  fs.writeFileSync('docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.html', suratHtml, 'utf8');
  console.log('Successfully written single-page surat HTML with base64 QR');
}

buildOnePageSurat();
