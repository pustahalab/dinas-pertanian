const fs = require('fs');

let php = fs.readFileSync('cpanel_esign/index.php', 'utf8');

php = php.replace('<div class="brand-logo">DJ</div>', '');
php = php.replace('<div class="signer-avatar">DJ</div>', '');

fs.writeFileSync('cpanel_esign/index.php', php, 'utf8');
console.log('Updated cpanel_esign/index.php without DJ logo');
