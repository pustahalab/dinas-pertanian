const fs = require('fs');

let html = fs.readFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html', 'utf8');

// 1. Replace Amounts & Words
html = html.replace(/Rp 296\.450\.000,-/g, 'Rp 247.450.000,-');
html = html.replace(/Rp 296\.450\.000/g, 'Rp 247.450.000');
html = html.replace(/Dua Ratus Sembilan Puluh Enam Juta Empat Ratus Lima Puluh Ribu Rupiah/g, 'Dua Ratus Empat Puluh Tujuh Juta Empat Ratus Lima Puluh Ribu Rupiah');
html = html.replace(/6 \(enam\) bulan/g, '4 (empat) bulan');
html = html.replace(/6 bulan/g, '4 bulan');

// 2. Update cover info & role
html = html.replace(
  /<div class="cover-pengusul">[\s\S]*?<\/div>\s*<\/div>/,
  `<div class="cover-pengusul">
        <p class="role-title">PENGUSUL & PENGEMBANG SISTEM:</p>
        <p class="name">Ir. Denny Jean Cross Sihombing, S.T., M.T.</p>
        <p class="affil">Pengembang Sistem Informasi & Konsultan Rekayasa Perangkat Lunak<br>(Dosen Program Studi Sistem Informasi, Universitas Katolik Indonesia Atma Jaya Jakarta)</p>
      </div>
    </div>`
);

// 3. Update Komponen 1 Table in HTML
const oldKomp1 = `<tbody>
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

const newKomp1 = `<tbody>
          <tr>
            <td class="center">1.1</td>
            <td>Ketua Tim / Lead Software Architect (Ir. Denny Jean Cross Sihombing, S.T., M.T.)</td>
            <td class="center">4</td>
            <td class="center">OB</td>
            <td class="right">12.500.000</td>
            <td class="right">50.000.000</td>
          </tr>
          <tr>
            <td class="center">1.2</td>
            <td>System Analyst & Business Process Specialist (Dian Violin Kapisa)</td>
            <td class="center">4</td>
            <td class="center">OB</td>
            <td class="right">7.500.000</td>
            <td class="right">30.000.000</td>
          </tr>
          <tr>
            <td class="center">1.3</td>
            <td>Senior Software Engineer & Database Architect</td>
            <td class="center">4</td>
            <td class="center">OB</td>
            <td class="right">9.000.000</td>
            <td class="right">36.000.000</td>
          </tr>
          <tr class="subtotal-row">
            <td colspan="5" class="right">Subtotal Komponen 1 (4 Bulan)</td>
            <td class="right">Rp 116.000.000</td>
          </tr>
        </tbody>`;

html = html.replace(oldKomp1, newKomp1);

// 4. Update Rekapitulasi Table in HTML
const oldRekap = /<tbody>\s*<tr>\s*<td class="center font-bold">1<\/td>\s*<td><strong>Komponen 1: Honorarium Tenaga Ahli Inti<\/strong><\/td>[\s\S]*?<\/tbody>/;

const newRekap = `<tbody>
          <tr>
            <td class="center font-bold">1</td>
            <td><strong>Komponen 1: Honorarium Tenaga Ahli Inti (4 Bulan)</strong></td>
            <td class="right font-bold">116.000.000</td>
            <td class="center">46,88%</td>
          </tr>
          <tr>
            <td class="center font-bold">2</td>
            <td><strong>Komponen 2: Infrastruktur Cloud Server, Domain, Database, & Lisensi</strong></td>
            <td class="right font-bold">50.550.000</td>
            <td class="center">20,43%</td>
          </tr>
          <tr>
            <td class="center font-bold">3</td>
            <td><strong>Komponen 3: Operasional Lapangan, Koordinasi, & Perjalanan Dinas ke Biak Numfor</strong></td>
            <td class="right font-bold">61.100.000</td>
            <td class="center">24,69%</td>
          </tr>
          <tr>
            <td class="center font-bold">4</td>
            <td><strong>Komponen 4: Pelatihan (TOT), Sosialisasi, Modul Panduan, & Dokumentasi Akhir</strong></td>
            <td class="right font-bold">19.800.000</td>
            <td class="center">8,00%</td>
          </tr>
          <tr class="grand-total-row">
            <td colspan="2" class="center font-bold" style="font-size: 10.5pt;">TOTAL KESELURUHAN ANGGARAN BIAYA (RAB) - 4 BULAN</td>
            <td class="right font-bold" style="font-size: 11pt;">Rp 247.450.000</td>
            <td class="center font-bold">100,00%</td>
          </tr>
        </tbody>`;

html = html.replace(oldRekap, newRekap);

// 5. Update BAB IV in HTML to 4 months
const oldBab4HTMLRegex = /<section id="bab4">[\s\S]*?<\/section>/;
const newBab4HTML = `<section id="bab4">
      <h2>BAB IV: JADWAL & TAHAPAN PELAKSANAAN PROYEK (4 BULAN)</h2>
      <p>
        Pekerjaan pengembangan dan implementasi sistem dirancang secara terstruktur dan intensif selama <strong>4 (empat) bulan kalender</strong> dengan tahapan jadwal pelaksanaan sebagai berikut:
      </p>
      <table>
        <thead>
          <tr>
            <th style="width: 5%;">No</th>
            <th style="width: 63%;">Tahapan Kegiatan Pelaksanaan Proyek</th>
            <th style="width: 8%;">Bulan 1</th>
            <th style="width: 8%;">Bulan 2</th>
            <th style="width: 8%;">Bulan 3</th>
            <th style="width: 8%;">Bulan 4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="center">1</td>
            <td>Kick-off Meeting, Koordinasi Dinas, Elisitasi Kebutuhan, & Validasi Data 500 Petani</td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
            <td></td><td></td><td></td>
          </tr>
          <tr>
            <td class="center">2</td>
            <td>Perancangan Arsitektur Sistem, Basis Data Relasional, & Wireframing UI Responsif</td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
            <td></td><td></td><td></td>
          </tr>
          <tr>
            <td class="center">3</td>
            <td>Pembangunan Core System (Modul Petani OAP, Verifikasi Berjenjang, Kartu Digital QR)</td>
            <td></td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
            <td></td><td></td>
          </tr>
          <tr>
            <td class="center">4</td>
            <td>Pembangunan Modul Operasional DAMRI (HTML5 Camera Scanner & Form Manifest Muatan)</td>
            <td></td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
            <td></td>
          </tr>
          <tr>
            <td class="center">5</td>
            <td>Pembangunan Modul Bantuan Otsus, Dashboard Eksekutif, & Laporan Resmi Kop Dinas</td>
            <td></td><td></td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
            <td></td>
          </tr>
          <tr>
            <td class="center">6</td>
            <td>Pengujian Sistem Internal (Unit Testing, Security Hardening, Cryptographic Session)</td>
            <td></td><td></td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
            <td></td>
          </tr>
          <tr>
            <td class="center">7</td>
            <td>Setup Server Cloud VPS, Domain Resmi Daerah, SSL Certificate Wildcard, & DB HA</td>
            <td></td><td></td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
          </tr>
          <tr>
            <td class="center">8</td>
            <td>UAT & Uji Coba Lapangan (Field Trial) Bersama Petugas Lapangan DAMRI di Biak</td>
            <td></td><td></td><td></td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
          </tr>
          <tr>
            <td class="center">9</td>
            <td>Pelatihan Operator (Training of Trainers / TOT), Modul Panduan, & Video Tutorial</td>
            <td></td><td></td><td></td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
          </tr>
          <tr>
            <td class="center">10</td>
            <td>Laporan Akhir, Berita Acara Serah Terima (BAST), & Pendampingan Go-Live</td>
            <td></td><td></td><td></td>
            <td class="center font-bold" style="background:#e0f2fe; color:#0369a1;">&block; &block; &block;</td>
          </tr>
        </tbody>
      </table>
    </section>`;

html = html.replace(oldBab4HTMLRegex, newBab4HTML);

fs.writeFileSync('docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html', html, 'utf8');
console.log('Successfully updated docs/PROPOSAL_PENGEMBANGAN_SISTEM_DAN_RAB.html for 4 months');
