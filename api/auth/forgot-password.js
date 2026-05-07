import crypto from 'crypto';
import { connectDB } from '../lib/db.js';
import Admin from '../lib/models/Admin.js';
import ResetToken from '../lib/models/ResetToken.js';
import { sendResetEmail } from '../lib/email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    await connectDB();

    // Check if admin exists with this email
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      // Don't reveal whether email exists — return same success message
      // But actually the user wants to block non-existing emails
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    // Invalidate any existing tokens for this email
    await ResetToken.updateMany(
      { email: admin.email, used: false },
      { used: true }
    );

    // Generate secure reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await ResetToken.create({
      email: admin.email,
      token,
      expiresAt,
    });

    // Build reset link (works for both dev and prod)
    let baseUrl = process.env.FRONTEND_URL;
    if (!baseUrl) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      baseUrl = `${protocol}://${host}`;
    }
    const resetLink = `${baseUrl}/panel/reset-password?token=${token}`;

    // Send reset email
    await sendResetEmail(admin.email, resetLink);

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to send reset email. Check SMTP configuration.' });
  }
}
