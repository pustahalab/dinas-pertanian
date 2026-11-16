const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const html = 'file:///' + path.resolve('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html').replace(/\\/g, '/');
const pdf = path.resolve('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.pdf');

// Check if locked, if locked write to temp then replace or sleep
try {
  const cmd = `"${chrome}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdf}" "${html}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('Success generating directly to:', pdf);
} catch (e) {
  console.log('Direct write failed, trying alternative:', e.message);
  const tempPdf = path.resolve('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB_LATEST.pdf');
  const cmd2 = `"${chrome}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${tempPdf}" "${html}"`;
  execSync(cmd2, { stdio: 'inherit' });
  console.log('Success generating to temp:', tempPdf, fs.statSync(tempPdf).size);
}
