const fs = require('fs');

const files = [
  'docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.md',
  'docs/SURAT_PENGAJUAN_PROPOSAL_KADIS_PERTANIAN_BIAK.html',
  'docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md',
  'docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('Pj. Bupati Biak Numfor')) {
    content = content.replace(/Pj\. Bupati Biak Numfor/g, 'Bupati Biak Numfor');
    fs.writeFileSync(f, content, 'utf8');
    console.log(`Replaced Pj. Bupati in ${f}`);
  }
});
