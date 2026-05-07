import { connectDB } from '../_lib/db.js';
import { verifyToken } from '../_lib/auth.js';
import Event from '../_lib/models/Event.js';

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { page = 1, limit = 50, eventName, startDate, endDate, visitorId, format } = req.query;

    const filter = {};
    if (eventName) filter.eventName = eventName;
    if (visitorId) filter.visitorId = visitorId;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // CSV Export
    if (format === 'csv') {
      const events = await Event.find(filter).sort({ timestamp: -1 }).limit(10000).lean();
      const csvHeader = 'timestamp,eventName,eventLabel,visitorId,ip,sessionId,metadata\n';
      const csvRows = events.map(e => 
        `${e.timestamp.toISOString()},${e.eventName},${e.eventLabel || ''},${e.visitorId},${e.ip || ''},${e.sessionId || ''},"${JSON.stringify(e.metadata || {}).replace(/"/g, '""')}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=events_export.csv');
      return res.status(200).send(csvHeader + csvRows);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [events, total, frequency] = await Promise.all([
      Event.find(filter).sort({ timestamp: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Event.countDocuments(filter),
      Event.aggregate([
        { $match: filter },
        { $group: { _id: '$eventName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return res.status(200).json({
      events,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      frequency,
    });
  } catch (err) {
    console.error('Events error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

