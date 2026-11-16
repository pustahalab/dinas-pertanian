const fs = require('fs');

let html = fs.readFileSync('docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.html', 'utf8');

// 1. Ubah .recipient-box agar TANPA background dan border
// Sebelum:
// .recipient-box {
//   margin: 6px 0 8px 0;
//   font-family: 'Plus Jakarta Sans', sans-serif;
//   font-size: 8.5pt;
//   line-height: 1.3;
//   background: #f8fafc;
//   border-left: 3px solid #0284c7;
//   padding: 6px 12px;
//   border-radius: 0 4px 4px 0;
// }
html = html.replace(
  /\.recipient-box\s*\{[\s\S]*?\}/,
  `.recipient-box {
      margin: 6px 0 8px 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8.5pt;
      line-height: 1.35;
      padding: 0;
      background: transparent;
      border: none;
    }`
);

// 2. Ubah .signature-card agar TANPA bingkai (border, background, box-shadow)
// Sebelum:
// .signature-card {
//   width: 320px;
//   font-family: 'Plus Jakarta Sans', sans-serif;
//   font-size: 7.5pt;
//   background: #ffffff;
//   border: 1px solid #e2e8f0;
//   border-radius: 6px;
//   padding: 8px 12px;
//   box-shadow: 0 2px 6px rgba(0,0,0,0.03);
// }
html = html.replace(
  /\.signature-card\s*\{[\s\S]*?\}/,
  `.signature-card {
      width: 320px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 7.5pt;
      background: transparent;
      border: none;
      padding: 0;
      box-shadow: none;
    }`
);

// Juga hilangkan border dan background pada .esign-badge-box di dalam signature
html = html.replace(
  /\.esign-badge-box\s*\{[\s\S]*?\}/,
  `.esign-badge-box {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 4px 0 6px 0;
      padding: 4px 0;
      background: transparent;
      border: none;
    }`
);

// 3. Ubah tembusan agar ke bawah berurut (nomor 1 sampai 4 berbaris ke bawah, bukan kesamping)
// Sebelum:
// <div class="tembusan-box">
//   <strong>Tembusan Yth:</strong><br>
//   1. Bupati Biak Numfor (sebagai laporan) &bull; 2. Sekretaris Daerah Kabupaten Biak Numfor &bull; 3. Kepala Bidang Prasarana, Sarana, dan Penyuluhan Dinas Pertanian Biak Numfor &bull; 4. Arsip / Pertinggal
// </div>
const oldTembusan = `<div class="tembusan-box">
      <strong>Tembusan Yth:</strong><br>
      1. Bupati Biak Numfor (sebagai laporan) &bull; 2. Sekretaris Daerah Kabupaten Biak Numfor &bull; 3. Kepala Bidang Prasarana, Sarana, dan Penyuluhan Dinas Pertanian Biak Numfor &bull; 4. Arsip / Pertinggal
    </div>`;

const newTembusan = `<div class="tembusan-box">
      <strong>Tembusan Yth:</strong>
      <ol style="margin: 2px 0 0 0; padding-left: 15px; font-size: 7pt; line-height: 1.25;">
        <li>Bupati Biak Numfor (sebagai laporan)</li>
        <li>Sekretaris Daerah Kabupaten Biak Numfor</li>
        <li>Kepala Bidang Prasarana, Sarana, dan Penyuluhan Dinas Pertanian Biak Numfor</li>
        <li>Arsip / Pertinggal</li>
      </ol>
    </div>`;

html = html.replace(oldTembusan, newTembusan);

fs.writeFileSync('docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.html', html, 'utf8');
console.log('Successfully updated docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.html');
