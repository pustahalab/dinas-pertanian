const fs = require('fs');

let html = fs.readFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html', 'utf8');

// Replace amounts in executive summary and intro
html = html.replace(/Rp 386\.550\.000,-/g, 'Rp 296.450.000,-');
html = html.replace(/Rp 386\.550\.000/g, 'Rp 296.450.000');
html = html.replace(/Tiga Ratus Delapan Puluh Enam Juta Lima Ratus Lima Puluh Ribu Rupiah/g, 'Dua Ratus Sembilan Puluh Enam Juta Empat Ratus Lima Puluh Ribu Rupiah');

// Update executive summary text regarding paperless
html = html.replace(
  /Total usulan anggaran biaya pengembangan[\s\S]*?enam bulan\./,
  'Total usulan anggaran biaya pengembangan, implementasi infrastruktur cloud berkinerja tinggi, pengujian lapangan di Biak Numfor, sosialisasi, pelatihan (TOT), hingga serah terima sistem digital murni berbasis aplikasi adalah sebesar <strong>Rp 296.450.000,- (Dua Ratus Sembilan Puluh Enam Juta Empat Ratus Lima Puluh Ribu Rupiah)</strong> untuk durasi pekerjaan selama <strong>6 (enam) bulan</strong>. Sesuai arahan efisiensi dan modernisasi tata kelola digital (<em>paperless & digital-native</em>), sistem beroperasi secara penuh melalui aplikasi web mobile dan pemindai QR Code di smartphone tanpa memerlukan pengadaan kartu fisik PVC maupun mesin cetak termal.'
);

// Update BAB III Susunan Tim Ahli
const oldTeamTable = `<tbody>
          <tr>
            <td class="center font-bold">1</td>
            <td><strong>Ketua Tim Pelaksana (Team Leader / Principal Investigator)</strong></td>
            <td><strong>Ir. Denny Jean Cross Sihombing, S.T., M.T.</strong></td>
            <td>Magister Teknik Informatika/Sistem Informasi, Dosen Tetap Unika Atma Jaya. Penanggung jawab keseluruhan manajemen proyek, tata kelola kelembagaan, arsitektur enterprise, dan kendali mutu metodologi.</td>
          </tr>
          <tr>
            <td class="center font-bold">2</td>
            <td><strong>System Analyst & Business Process Specialist</strong></td>
            <td>Dian Violin Kapisa</td>
            <td>Sarjana Sistem Informasi, peneliti domain spesifik pertanian Biak Numfor. Bertanggung jawab atas analisis kebutuhan fungsional, alur proses dinas-DAMRI, dan validasi data petani.</td>
          </tr>
          <tr>
            <td class="center font-bold">3</td>
            <td><strong>Senior Software Engineer & Database Architect</strong></td>
            <td>Tenaga Ahli Rekayasa Perangkat Lunak</td>
            <td>Pengalaman >7 tahun Node.js & MySQL. Bertanggung jawab atas core backend engine, keamanan database, API sinkronisasi, dan optimasi query.</td>
          </tr>
          <tr>
            <td class="center font-bold">4</td>
            <td><strong>UI/UX Designer & Frontend Developer</strong></td>
            <td>Desainer Produk Digital & Frontend</td>
            <td>Pengalaman >5 tahun web responsif. Bertanggung jawab atas antarmuka sistem, modul kartu cetak resolusi tinggi, dan visualisasi dashboard pimpinan.</td>
          </tr>
          <tr>
            <td class="center font-bold">5</td>
            <td><strong>Hardware Integration & QA/Security Tester</strong></td>
            <td>Spesialis Pengujian & Scanner Lapangan</td>
            <td>Bertanggung jawab atas pengujian kompabilitas kamera QR multi-perangkat ponsel pintar, stress test, penetrasi keamanan web, dan UAT.</td>
          </tr>
          <tr>
            <td class="center font-bold">6</td>
            <td><strong>Field Implementation & Training Specialist</strong></td>
            <td>Tenaga Pendamping Lapangan (Biak)</td>
            <td>Fasilitator lapangan di Biak Numfor, pendampingan operator dinas, koordinator distrik, dan petugas lapangan DAMRI.</td>
          </tr>
        </tbody>`;

const newTeamTable = `<tbody>
          <tr>
            <td class="center font-bold">1</td>
            <td><strong>Ketua Tim Pelaksana (Team Leader / Principal Investigator)</strong></td>
            <td><strong>Ir. Denny Jean Cross Sihombing, S.T., M.T.</strong></td>
            <td>Magister Teknik Informatika/Sistem Informasi, Dosen Tetap Program Studi Sistem Informasi Unika Atma Jaya Jakarta. Penanggung jawab keseluruhan manajemen proyek, koordinasi kelembagaan dinas, perancangan arsitektur enterprise, kendali mutu, dan supervisi metodologi.</td>
          </tr>
          <tr>
            <td class="center font-bold">2</td>
            <td><strong>System Analyst & Business Process Specialist</strong></td>
            <td>Dian Violin Kapisa</td>
            <td>Sarjana Sistem Informasi, peneliti domain spesifik pertanian Biak Numfor. Bertanggung jawab atas elisitasi kebutuhan fungsional, alur proses dinas-DAMRI, validasi data 500+ petani OAP, dan modul pengujian.</td>
          </tr>
          <tr>
            <td class="center font-bold">3</td>
            <td><strong>Senior Software Engineer & Database Architect</strong></td>
            <td>Tenaga Ahli Rekayasa Perangkat Lunak (Senior Fullstack)</td>
            <td>Pengalaman >7 tahun arsitektur Node.js & MySQL. Bertanggung jawab atas core backend, skema basis data, modul QR scanner, antarmuka responsif mobile, dan keamanan sistem.</td>
          </tr>
        </tbody>`;

html = html.replace(oldTeamTable, newTeamTable);

// Update Komponen 1 Table in HTML
const oldKomp1 = `<tbody>
          <tr>
            <td class="center">1.1</td>
            <td>Team Leader / Principal Investigator (Ir. Denny Jean Cross Sihombing, S.T., M.T.)</td>
            <td class="center">6</td>
            <td class="center">OB</td>
            <td class="right">12.500.000</td>
            <td class="right">75.000.000</td>
          </tr>
          <tr>
            <td class="center">1.2</td>
            <td>System Analyst & Business Process Specialist</td>
            <td class="center">6</td>
            <td class="center">OB</td>
            <td class="right">7.500.000</td>
            <td class="right">45.000.000</td>
          </tr>
          <tr>
            <td class="center">1.3</td>
            <td>Senior Backend & Database Engineer</td>
            <td class="center">5</td>
            <td class="center">OB</td>
            <td class="right">9.000.000</td>
            <td class="right">45.000.000</td>
          </tr>
          <tr>
            <td class="center">1.4</td>
            <td>Frontend Developer & UI/UX Specialist</td>
            <td class="center">4</td>
            <td class="center">OB</td>
            <td class="right">7.000.000</td>
            <td class="right">28.000.000</td>
          </tr>
          <tr>
            <td class="center">1.5</td>
            <td>QA Tester & Security Assessment Specialist</td>
            <td class="center">3</td>
            <td class="center">OB</td>
            <td class="right">6.000.000</td>
            <td class="right">18.000.000</td>
          </tr>
          <tr>
            <td class="center">1.6</td>
            <td>Field Implementation & Training Specialist (Biak)</td>
            <td class="center">4</td>
            <td class="center">OB</td>
            <td class="right">5.500.000</td>
            <td class="right">22.000.000</td>
          </tr>
          <tr class="subtotal-row">
            <td colspan="5" class="right">Subtotal Komponen 1</td>
            <td class="right">Rp 233.000.000</td>
          </tr>
        </tbody>`;

const newKomp1 = `<tbody>
          <tr>
            <td class="center">1.1</td>
            <td>Ketua Tim / Team Leader (Ir. Denny Jean Cross Sihombing, S.T., M.T.)</td>
            <td class="center">6</td>
            <td class="center">OB</td>
            <td class="right">12.500.000</td>
            <td class="right">75.000.000</td>
          </tr>
          <tr>
            <td class="center">1.2</td>
            <td>System Analyst & Business Process Specialist (Dian Violin Kapisa)</td>
            <td class="center">6</td>
            <td class="center">OB</td>
            <td class="right">7.500.000</td>
            <td class="right">45.000.000</td>
          </tr>
          <tr>
            <td class="center">1.3</td>
            <td>Senior Software Engineer & Database Architect</td>
            <td class="center">5</td>
            <td class="center">OB</td>
            <td class="right">9.000.000</td>
            <td class="right">45.000.000</td>
          </tr>
          <tr class="subtotal-row">
            <td colspan="5" class="right">Subtotal Komponen 1</td>
            <td class="right">Rp 165.000.000</td>
          </tr>
        </tbody>`;

html = html.replace(oldKomp1, newKomp1);

// Remove entire old Komponen 3 table and re-number Komponen 4 & 5
const oldKomp345Regex = /<h4>Komponen 3: Pengadaan Perangkat Uji Coba[\s\S]*?Subtotal Komponen 5[\s\S]*?<\/tbody>\s*<\/table>/;

const newKomp34 = `<h4>Komponen 3: Operasional Lapangan, Koordinasi, & Perjalanan Dinas ke Biak Numfor</h4>
      <table>
        <thead>
          <tr>
            <th style="width: 5%;">No</th>
            <th style="width: 50%;">Uraian Perjalanan Dinas & Operasional</th>
            <th style="width: 10%;">Vol</th>
            <th style="width: 10%;">Satuan</th>
            <th style="width: 12%;">Biaya Satuan (Rp)</th>
            <th style="width: 13%;">Subtotal (Rp)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="center">3.1</td>
            <td>Tiket Pesawat PP Jakarta - Biak (Tim Ahli 2 Orang x 2 Kunjungan)</td>
            <td class="center">4</td>
            <td class="center">Tiket PP</td>
            <td class="right">6.500.000</td>
            <td class="right">26.000.000</td>
          </tr>
          <tr>
            <td class="center">3.2</td>
            <td>Akomodasi & Penginapan di Biak Numfor (2 Orang x 3 Hari x 2 Kunjungan)</td>
            <td class="center">12</td>
            <td class="center">Hari/Orang</td>
            <td class="right">1.000.000</td>
            <td class="right">12.000.000</td>
          </tr>
          <tr>
            <td class="center">3.3</td>
            <td>Transportasi Lokal Lapangan (Sewa Kendaraan Roda 4 Survei Distrik)</td>
            <td class="center">14</td>
            <td class="center">Hari</td>
            <td class="right">750.000</td>
            <td class="right">10.500.000</td>
          </tr>
          <tr>
            <td class="center">3.4</td>
            <td>Uang Harian Perjalanan Dinas Tim Ahli sesuai SBM Daerah</td>
            <td class="center">28</td>
            <td class="center">Hari/Orang</td>
            <td class="right">450.000</td>
            <td class="right">12.600.000</td>
          </tr>
          <tr class="subtotal-row">
            <td colspan="5" class="right">Subtotal Komponen 3</td>
            <td class="right">Rp 61.100.000</td>
          </tr>
        </tbody>
      </table>

      <h4>Komponen 4: Pelatihan (Training of Trainers), Sosialisasi, Dokumentasi, & Pelaporan</h4>
      <table>
        <thead>
          <tr>
            <th style="width: 5%;">No</th>
            <th style="width: 50%;">Uraian Kegiatan Pelatihan & Pelaporan</th>
            <th style="width: 10%;">Vol</th>
            <th style="width: 10%;">Satuan</th>
            <th style="width: 12%;">Biaya Satuan (Rp)</th>
            <th style="width: 13%;">Subtotal (Rp)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="center">4.1</td>
            <td>Konsumsi & Fasilitasi Workshop Pelatihan Operator Dinas & Petugas DAMRI (35 Peserta x 2 Hari)</td>
            <td class="center">70</td>
            <td class="center">Orang/Hari</td>
            <td class="right">125.000</td>
            <td class="right">8.750.000</td>
          </tr>
          <tr>
            <td class="center">4.2</td>
            <td>Penggandaan Modul Buku Panduan Administrator, PPL, dan Petugas DAMRI (Cetak Glossy)</td>
            <td class="center">50</td>
            <td class="center">Buku</td>
            <td class="right">95.000</td>
            <td class="right">4.750.000</td>
          </tr>
          <tr>
            <td class="center">4.3</td>
            <td>Pembuatan Video Panduan Penggunaan (Video Tutorial Animasi & Live Demo)</td>
            <td class="center">1</td>
            <td class="center">Paket</td>
            <td class="right">4.500.000</td>
            <td class="right">4.500.000</td>
          </tr>
          <tr>
            <td class="center">4.4</td>
            <td>Penyusunan Berkas Laporan Akhir Proyek, Arsitektur Sistem, & Berita Acara (Hardcover)</td>
            <td class="center">5</td>
            <td class="center">Eksemplar</td>
            <td class="right">360.000</td>
            <td class="right">1.800.000</td>
          </tr>
          <tr class="subtotal-row">
            <td colspan="5" class="right">Subtotal Komponen 4</td>
            <td class="right">Rp 19.800.000</td>
          </tr>
        </tbody>
      </table>`;

html = html.replace(oldKomp345Regex, newKomp34);

// Replace Rekapitulasi Table in HTML
const oldRekap = /<tbody>\s*<tr>\s*<td class="center font-bold">1<\/td>\s*<td><strong>Komponen 1: Honorarium Tenaga Ahli[\s\S]*?<\/tbody>/;

const newRekap = `<tbody>
          <tr>
            <td class="center font-bold">1</td>
            <td><strong>Komponen 1: Honorarium Tenaga Ahli Inti</strong></td>
            <td class="right font-bold">165.000.000</td>
            <td class="center">55,66%</td>
          </tr>
          <tr>
            <td class="center font-bold">2</td>
            <td><strong>Komponen 2: Infrastruktur Cloud Server, Domain, Database, & Lisensi</strong></td>
            <td class="right font-bold">50.550.000</td>
            <td class="center">17,05%</td>
          </tr>
          <tr>
            <td class="center font-bold">3</td>
            <td><strong>Komponen 3: Operasional Lapangan, Koordinasi, & Perjalanan Dinas ke Biak Numfor</strong></td>
            <td class="right font-bold">61.100.000</td>
            <td class="center">20,61%</td>
          </tr>
          <tr>
            <td class="center font-bold">4</td>
            <td><strong>Komponen 4: Pelatihan (TOT), Sosialisasi, Modul Panduan, & Dokumentasi Akhir</strong></td>
            <td class="right font-bold">19.800.000</td>
            <td class="center">6,68%</td>
          </tr>
          <tr class="grand-total-row">
            <td colspan="2" class="center font-bold" style="font-size: 10.5pt;">TOTAL KESELURUHAN ANGGARAN BIAYA (RAB)</td>
            <td class="right font-bold" style="font-size: 11pt;">Rp 296.450.000</td>
            <td class="center font-bold">100,00%</td>
          </tr>
        </tbody>`;

html = html.replace(oldRekap, newRekap);

fs.writeFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html', html, 'utf8');
console.log('Successfully updated docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html');
