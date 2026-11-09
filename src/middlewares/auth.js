function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
    }
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Silakan login terlebih dahulu untuk mengakses halaman ini.');
    return res.redirect('/login');
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
      }
      return res.redirect('/login');
    }

    const userRole = req.session.user.role;
    if (!roles.includes(userRole)) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(403).json({ success: false, message: 'Anda tidak memiliki hak akses untuk tindakan ini.' });
      }
      req.flash('error', `Akses ditolak. Halaman ini memerlukan hak akses [${roles.join(', ')}].`);
      return res.redirect('/dashboard');
    }

    next();
  };
}

function redirectIfAuth(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
}

module.exports = {
  requireAuth,
  requireRole,
  redirectIfAuth
};
