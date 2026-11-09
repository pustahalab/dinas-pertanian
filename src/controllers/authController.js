const pool = require('../config/db');
const { verifyPassword } = require('../utils/security');
const { logAudit } = require('../utils/auditLogger');

exports.showLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Masuk ke Sistem - SIM-KARTANI Biak Numfor'
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND is_active = 1', [username]);

    if (rows.length === 0) {
      req.flash('error', 'Nama pengguna atau kata sandi tidak valid.');
      return res.redirect('/login');
    }

    const user = rows[0];
    const match = verifyPassword(password, user.password);

    if (!match) {
      req.flash('error', 'Nama pengguna atau kata sandi tidak valid.');
      return res.redirect('/login');
    }

    // Set session user
    req.session.user = {
      id: user.id,
      username: user.username,
      nama_lengkap: user.nama_lengkap,
      role: user.role,
      jabatan: user.jabatan,
      nip: user.nip,
      petani_id: user.petani_id
    };

    await logAudit(req, 'LOGIN', 'users', user.id, `Pengguna [${user.username}] (${user.role}) berhasil masuk.`);

    req.flash('success', `Selamat datang kembali, ${user.nama_lengkap}!`);
    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    return res.redirect(returnTo);
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Terjadi kesalahan sistem saat proses masuk.');
    return res.redirect('/login');
  }
};

exports.quickLogin = async (req, res) => {
  const { role } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE role = ? AND is_active = 1 LIMIT 1', [role]);
    if (rows.length === 0) {
      req.flash('error', `Akun untuk peran ${role} tidak ditemukan.`);
      return res.redirect('/login');
    }

    const user = rows[0];
    req.session.user = {
      id: user.id,
      username: user.username,
      nama_lengkap: user.nama_lengkap,
      role: user.role,
      jabatan: user.jabatan,
      nip: user.nip,
      petani_id: user.petani_id
    };

    await logAudit(req, 'QUICK_LOGIN_DEMO', 'users', user.id, `Login cepat sebagai [${user.role}] untuk demo.`);
    req.flash('success', `Berhasil masuk demo sebagai: ${user.nama_lengkap} (${user.role.toUpperCase()})`);
    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Quick login error:', err);
    req.flash('error', 'Gagal melakukan login demo.');
    return res.redirect('/login');
  }
};

exports.logout = async (req, res) => {
  if (req.session?.user) {
    await logAudit(req, 'LOGOUT', 'users', req.session.user.id, `Pengguna [${req.session.user.username}] keluar.`);
  }
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
