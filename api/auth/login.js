import bcrypt from 'bcryptjs';
import { connectDB } from '../_lib/db.js';
import { createToken, setTokenCookie } from '../_lib/auth.js';
import { checkRateLimit, recordLoginAttempt } from '../_lib/rateLimit.js';
import Admin from '../_lib/models/Admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // Rate limit check
  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      error: 'Too many login attempts. Try again later.',
      resetAt: rateLimit.resetAt,
    });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    await connectDB();

    // Find admin by email in database
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      await recordLoginAttempt(ip, email, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password with stored hash
    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      await recordLoginAttempt(ip, email, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Success - issue JWT
    await recordLoginAttempt(ip, email, true);
    const token = createToken({ email: admin.email, role: 'admin' });
    setTokenCookie(res, token);

    return res.status(200).json({ success: true, message: 'Authenticated' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

