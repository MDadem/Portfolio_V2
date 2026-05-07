import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const token = cookies.panel_token;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
}

export function setTokenCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', 
    `panel_token=${token}; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Strict; Path=/; Max-Age=7200`
  );
}

export function clearTokenCookie(res) {
  res.setHeader('Set-Cookie', 
    `panel_token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`
  );
}

function parseCookies(cookieString) {
  const cookies = {};
  if (!cookieString) return cookies;
  cookieString.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    cookies[name] = rest.join('=');
  });
  return cookies;
}

