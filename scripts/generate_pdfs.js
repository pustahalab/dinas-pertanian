const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const tasks = [
  {
    html: path.resolve('docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.html'),
    pdf: path.resolve('docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.pdf')
  },
  {
    html: path.resolve('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html'),
    pdf: path.resolve('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.pdf')
  }
];

for (const t of tasks) {
  const fileUrl = 'file:///' + t.html.replace(/\\/g, '/');
  const pdfOut = t.pdf;
  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfOut}" "${fileUrl}"`;
  console.log('Executing:', cmd);
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(pdfOut)) {
    console.log(`Success: ${path.basename(pdfOut)} (${fs.statSync(pdfOut).size} bytes)`);
  } else {
    console.error(`Failed to generate ${pdfOut}`);
  }
}
