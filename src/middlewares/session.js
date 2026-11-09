const crypto = require('crypto');

// In-memory session store (keyed by sessionId)
const sessions = new Map();

const SESSION_COOKIE_NAME = 'kartani_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'biak-numfor-otsus-secret-key-2026';

function sign(value, secret) {
  return value + '.' + crypto.createHmac('sha256', secret).update(value).digest('base64').replace(/=+$/, '');
}

function unsign(val, secret) {
  const str = val.slice(0, val.lastIndexOf('.'));
  const mac = sign(str, secret);
  const macBuffer = Buffer.from(mac);
  const valBuffer = Buffer.from(val);
  if (macBuffer.length === valBuffer.length && crypto.timingSafeEqual(macBuffer, valBuffer)) {
    return str;
  }
  return false;
}

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

function sessionMiddleware(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  const rawCookie = cookies[SESSION_COOKIE_NAME];
  let sid = null;

  if (rawCookie) {
    sid = unsign(rawCookie, SESSION_SECRET);
  }

  if (!sid || !sessions.has(sid)) {
    sid = crypto.randomBytes(24).toString('hex');
    sessions.set(sid, {
      id: sid,
      created: Date.now(),
      lastAccessed: Date.now(),
      data: {}
    });
    // Set cookie
    const signedVal = sign(sid, SESSION_SECRET);
    res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=${encodeURIComponent(signedVal)}; Path=/; HttpOnly; SameSite=Lax`);
  }

  const sessionObj = sessions.get(sid);
  sessionObj.lastAccessed = Date.now();

  // Expose req.session proxy
  req.session = new Proxy(sessionObj.data, {
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    get(target, prop) {
      if (prop === 'destroy') {
        return function (cb) {
          sessions.delete(sid);
          res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`);
          if (cb) cb();
        };
      }
      return target[prop];
    }
  });

  // Flash message support
  res.locals.flashSuccess = req.session.flashSuccess || null;
  res.locals.flashError = req.session.flashError || null;
  delete req.session.flashSuccess;
  delete req.session.flashError;

  req.flash = function (type, msg) {
    if (type === 'success') req.session.flashSuccess = msg;
    if (type === 'error') req.session.flashError = msg;
  };

  // Expose current logged-in user to all views
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;

  next();
}

module.exports = sessionMiddleware;
