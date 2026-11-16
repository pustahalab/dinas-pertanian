const fs = require('fs');

console.log("=== CALCULATING 4-MONTH BUDGET ===");

// 1. Komponen 1: Honorarium Tenaga Ahli (4 Bulan)
// 1.1 Team Leader: 4 OB x 12.500.000 = 50.000.000
// 1.2 System Analyst: 4 OB x 7.500.000 = 30.000.000
// 1.3 Senior Software Engineer & DB: 4 OB x 9.000.000 = 36.000.000
const komp1 = 50000000 + 30000000 + 36000000; // 116.000.000

// 2. Komponen 2: Cloud Server, Domain, DB (12 Bulan / 1 Tahun lisensi tetap 1 tahun untuk operasional dinas)
// Tetap 50.550.000
const komp2 = 22200000 + 13200000 + 2850000 + 7800000 + 4500000; // 50.550.000

// 3. Komponen 3: Operasional Lapangan & Perjalanan Dinas ke Biak Numfor
// Tetap 2 kunjungan (Kick-off/Survei & UAT/Go-Live)
// 3.1 Tiket: 4 PP x 6.500.000 = 26.000.000
// 3.2 Akomodasi: 2 orang x 3 hari x 2 kunjungan = 12 hari/orang x 1.000.000 = 12.000.000
// 3.3 Sewa Kendaraan: 14 hari x 750.000 = 10.500.000
// 3.4 Uang harian: 28 hari/orang x 450.000 = 12.600.000
const komp3 = 26000000 + 12000000 + 10500000 + 12600000; // 61.100.000

// 4. Komponen 4: Pelatihan (TOT), Sosialisasi, Panduan, Pelaporan
// 4.1 Konsumsi workshop: 70 OH x 125.000 = 8.750.000
// 4.2 Modul panduan: 50 buku x 95.000 = 4.750.000
// 4.3 Video tutorial: 1 paket = 4.500.000
// 4.4 Laporan akhir & BAST: 5 eks x 360.000 = 1.800.000
const komp4 = 8750000 + 4750000 + 4500000 + 1800000; // 19.800.000

const total = komp1 + komp2 + komp3 + komp4;

console.log("Komp 1:", komp1);
console.log("Komp 2:", komp2);
console.log("Komp 3:", komp3);
console.log("Komp 4:", komp4);
console.log("TOTAL 4 BULAN:", total);
console.log("Pct 1:", (komp1/total*100).toFixed(2));
console.log("Pct 2:", (komp2/total*100).toFixed(2));
console.log("Pct 3:", (komp3/total*100).toFixed(2));
console.log("Pct 4:", (komp4/total*100).toFixed(2));
