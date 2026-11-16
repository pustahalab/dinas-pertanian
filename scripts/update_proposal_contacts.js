const fs = require('fs');

let md = fs.readFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md', 'utf8');

// Replace IDENTITAS PENGUSUL
const oldId = `### IDENTITAS PENGUSUL & PENGEMBANG SISTEM
* **Nama Pengusul** : **Ir. Denny Jean Cross Sihombing, S.T., M.T.**
* **Peran / Kapasitas** : Pengembang Sistem Informasi & Konsultan Rekayasa Perangkat Lunak *(bertindak mandiri atas nama profesional pengembang)*
* **Latar Belakang Akademisi** : Dosen Program Studi Sistem Informasi, Universitas Katolik Indonesia Atma Jaya Jakarta
* **Alamat Korespondensi** : Jl. Jenderal Sudirman No. 51, Semanggi, Jakarta Selatan 12930
* **Email / Kontak** : denny.sihombing@atmajaya.ac.id / dennyjeancross@gmail.com | +62 812-XXXX-XXXX
* **Bidang Keahlian** : Rekayasa Sistem Informasi, Arsitektur Basis Data Enterprise, Keamanan Perangkat Lunak, Tata Kelola Sistem Pemerintahan`;

const newId = `### IDENTITAS PENGUSUL & PENGEMBANG SISTEM
* **Nama Pengusul** : **Ir. Denny Jean Cross Sihombing, S.T., M.T.**
* **Peran / Kapasitas** : Pengembang Sistem Informasi & Konsultan Rekayasa Perangkat Lunak *(bertindak mandiri atas nama profesional pengembang sistem)*
* **Latar Belakang Akademisi** : Dosen Program Studi Sistem Informasi, Universitas Katolik Indonesia Atma Jaya Jakarta
* **Laman Web Portofolio** : **dennyjcs.com**
* **Pos-el Resmi** : **denny.jean@atmajaya.ac.id**
* **Bidang Keahlian** : Rekayasa Sistem Informasi, Arsitektur Basis Data Enterprise, Keamanan Perangkat Lunak, Tata Kelola Sistem Pemerintahan`;

md = md.replace(oldId, newId);

// Also replace any old email in proposal footer or text
md = md.replace(/denny\.sihombing@atmajaya\.ac\.id/g, 'denny.jean@atmajaya.ac.id');
md = md.replace(/\+62 812-[^\n]+/g, 'Website: dennyjcs.com');
md = md.replace(/0812-[^\n]+/g, 'Website: dennyjcs.com');

fs.writeFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md', md, 'utf8');
console.log('Successfully updated docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.md with new email and web');
