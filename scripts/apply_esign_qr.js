const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

async function applyESign() {
  console.log('Generating QR code for digital signature...');

  const verifyUrl = 'https://dennyjcs.com/e-sign?doc=PROP-KARTANI-BIAK-2026&signer=Ir.+Denny+Jean+Cross+Sihombing,+S.T.,+M.T.&issued=2026-11-16';
  
  const qrDataUrl = await qrcode.toDataURL(verifyUrl, {
    margin: 1,
    width: 140,
    color: {
      dark: '#092c4c',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  });

  console.log('QR Code generated successfully. Length:', qrDataUrl.length);

  // 1. UPDATE SURAT PENGAJUAN PROPOSAL (HTML)
  let suratHtml = fs.readFileSync('docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.html', 'utf8');

  const oldSuratSig = `<div class="signatures">
      <div class="signature-block">
        Hormat saya,<br>
        <strong>Pengusul & Pengembang Sistem,</strong>
        <div class="signature-space"></div>
        <strong><u>Ir. Denny Jean Cross Sihombing, S.T., M.T.</u></strong><br>
        Pengembang Sistem Informasi / Arsitek Perangkat Lunak<br>
        <em>Dosen Prodi Sistem Informasi, Unika Atma Jaya Jakarta</em><br>
        Website: dennyjcs.com<br>
        Pos-el: denny.jean@atmajaya.ac.id
      </div>
    </div>`;

  const newSuratSig = `<div class="signatures">
      <div class="signature-block">
        Hormat saya,<br>
        <strong>Pengusul & Pengembang Sistem,</strong>
        <div style="display: flex; align-items: center; gap: 12px; margin: 8px 0 10px 0;">
          <a href="${verifyUrl}" target="_blank" style="text-decoration: none;">
            <img src="${qrDataUrl}" alt="Digital Signature QR Code" style="width: 78px; height: 78px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px; background: white;" />
          </a>
          <div style="font-size: 7.5pt; color: #475569; line-height: 1.35; border-left: 2px solid #0284c7; padding-left: 8px;">
            <strong style="color: #092c4c; font-size: 8pt; display: block;">DITANDATANGANI SECARA ELEKTRONIK</strong>
            Token ID: <span style="font-family: monospace; color: #0284c7;">DJCS-ESIGN-BIAK-2026</span><br>
            Verifikasi resmi: <a href="https://dennyjcs.com/e-sign" target="_blank" style="color: #0284c7; text-decoration: none; font-weight: bold;">dennyjcs.com/e-sign</a><br>
            Waktu: 16 November 2026
          </div>
        </div>
        <strong><u>Ir. Denny Jean Cross Sihombing, S.T., M.T.</u></strong><br>
        Pengembang Sistem Informasi / Arsitek Perangkat Lunak<br>
        <em>Dosen Program Studi Sistem Informasi, Unika Atma Jaya Jakarta</em><br>
        Laman: <strong>dennyjcs.com</strong> &bull; Pos-el: <strong>denny.jean@atmajaya.ac.id</strong>
      </div>
    </div>`;

  suratHtml = suratHtml.replace(oldSuratSig, newSuratSig);
  fs.writeFileSync('docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.html', suratHtml, 'utf8');
  console.log('Updated docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.html with E-Sign QR');

  // 2. UPDATE PROPOSAL LENGKAP & RAB (HTML)
  let propHtml = fs.readFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html', 'utf8');

  const oldPropSig = `<div class="sig-wrapper">
        <div class="sig-box">
          Jakarta, 16 November 2026<br>
          Hormat saya,<br>
          <strong>Pengusul & Pengembang Sistem,</strong>
          <div class="sig-space"></div>
          <strong><u>Ir. Denny Jean Cross Sihombing, S.T., M.T.</u></strong><br>
          Pengembang Sistem Informasi / Arsitek Perangkat Lunak<br>
          <em>Dosen Program Studi Sistem Informasi, Unika Atma Jaya Jakarta</em><br>
          Website: <strong>dennyjcs.com</strong> &bull; Pos-el: <strong>denny.jean@atmajaya.ac.id</strong>
        </div>
      </div>`;

  const newPropSig = `<div class="sig-wrapper">
        <div class="sig-box">
          Jakarta, 16 November 2026<br>
          Hormat saya,<br>
          <strong>Pengusul & Pengembang Sistem,</strong>
          <div style="display: flex; align-items: center; gap: 10px; margin: 6px 0 8px 0;">
            <a href="${verifyUrl}" target="_blank" style="text-decoration: none;">
              <img src="${qrDataUrl}" alt="Digital Signature QR Code" style="width: 72px; height: 72px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px; background: white;" />
            </a>
            <div style="font-size: 7pt; color: #475569; line-height: 1.3; border-left: 2px solid #0284c7; padding-left: 8px;">
              <strong style="color: #092c4c; font-size: 7.5pt; display: block;">DITANDATANGANI SECARA ELEKTRONIK</strong>
              Dokumen: Usulan SIM-KARTANI Biak<br>
              Token ID: <span style="font-family: monospace; color: #0284c7;">DJCS-ESIGN-PROP-2026</span><br>
              Verifikasi keaslian: <a href="https://dennyjcs.com/e-sign" target="_blank" style="color: #0284c7; text-decoration: none; font-weight: bold;">dennyjcs.com/e-sign</a>
            </div>
          </div>
          <strong><u>Ir. Denny Jean Cross Sihombing, S.T., M.T.</u></strong><br>
          Pengembang Sistem Informasi / Arsitek Perangkat Lunak<br>
          <em>Dosen Program Studi Sistem Informasi, Unika Atma Jaya Jakarta</em><br>
          Laman: <strong>dennyjcs.com</strong> &bull; Pos-el: <strong>denny.jean@atmajaya.ac.id</strong>
        </div>
      </div>`;

  propHtml = propHtml.replace(oldPropSig, newPropSig);
  fs.writeFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html', propHtml, 'utf8');
  console.log('Updated docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html with E-Sign QR');
}

applyESign();
