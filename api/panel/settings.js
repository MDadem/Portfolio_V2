import { connectDB } from '../_lib/db.js';
import { verifyToken } from '../_lib/auth.js';
import Visitor from '../_lib/models/Visitor.js';
import Event from '../_lib/models/Event.js';
import Admin from '../_lib/models/Admin.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  await connectDB();

  if (req.method === 'GET') {
    const totalVisitors = await Visitor.countDocuments();
    const totalEvents = await Event.countDocuments();
    const oldestRecord = await Visitor.findOne().sort({ createdAt: 1 }).select('createdAt').lean();

    return res.status(200).json({
      trackingEnabled: process.env.TRACKING_ENABLED !== 'false',
      whitelistIps: (process.env.WHITELIST_IPS || '').split(',').filter(Boolean),
      totalVisitors,
      totalEvents,
      oldestRecord: oldestRecord?.createdAt || null,
    });
  }

  if (req.method === 'POST') {
    const { action, payload } = req.body || {};

    switch (action) {
      case 'clear_old_data': {
        const days = parseInt(payload?.days) || 30;
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        
        const [deletedVisitors, deletedEvents] = await Promise.all([
          Visitor.deleteMany({ createdAt: { $lt: cutoff } }),
          Event.deleteMany({ timestamp: { $lt: cutoff } }),
        ]);

        return res.status(200).json({
          success: true,
          deletedVisitors: deletedVisitors.deletedCount,
          deletedEvents: deletedEvents.deletedCount,
        });
      }

      case 'export_data': {
        const [visitors, events] = await Promise.all([
          Visitor.find().lean(),
          Event.find().lean(),
        ]);

        const format = payload?.format || 'json';
        
        if (format === 'csv') {
          const visitorCsv = 'visitorId,ip,country,city,browser,os,deviceType,referrer,sessionDuration,createdAt\n' +
            visitors.map(v => `${v.visitorId},${v.ip},${v.country},${v.city},${v.browser},${v.os},${v.deviceType},${v.referrer},${v.sessionDuration},${v.createdAt?.toISOString()}`).join('\n');
          
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=portfolio_data_export.csv');
          return res.status(200).send(visitorCsv);
        }

        return res.status(200).json({ visitors, events });
      }

      case 'change_password': {
        const { currentPassword, newPassword } = payload || {};
        if (!currentPassword || !newPassword) {
          return res.status(400).json({ error: 'Both current and new password are required' });
        }
        if (newPassword.length < 8) {
          return res.status(400).json({ error: 'New password must be at least 8 characters' });
        }

        const admin = await Admin.findOne({ email: user.email });
        if (!admin) {
          return res.status(404).json({ error: 'Admin account not found' });
        }

        const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!isValid) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }

        admin.passwordHash = await bcrypt.hash(newPassword, 12);
        await admin.save();

        return res.status(200).json({ success: true, message: 'Password updated successfully' });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

