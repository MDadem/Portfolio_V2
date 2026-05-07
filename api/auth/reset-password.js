import bcrypt from 'bcryptjs';
import { connectDB } from '../lib/db.js';
import Admin from '../lib/models/Admin.js';
import ResetToken from '../lib/models/ResetToken.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, newPassword } = req.body || {};

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    await connectDB();

    // Find valid reset token
    const resetToken = await ResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' });
    }

    // Find admin
    const admin = await Admin.findOne({ email: resetToken.email });
    if (!admin) {
      return res.status(400).json({ error: 'Account not found' });
    }

    // Hash new password (12 salt rounds)
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update admin password
    admin.passwordHash = passwordHash;
    await admin.save();

    // Mark token as used
    resetToken.used = true;
    await resetToken.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully. You can now log in.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
