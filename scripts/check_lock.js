const fs = require('fs');

try {
  const fd = fs.openSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.pdf', 'r+');
  fs.closeSync(fd);
  console.log('UNLOCKED: File is free to write.');
} catch (e) {
  console.log('LOCKED:', e.code, e.message);
}
