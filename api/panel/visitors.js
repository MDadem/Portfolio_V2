import { connectDB } from '../_lib/db.js';
import { verifyToken } from '../_lib/auth.js';
import Visitor from '../_lib/models/Visitor.js';

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { page = 1, limit = 20, country, browser, sort = '-createdAt', search } = req.query;

    const filter = {};
    if (country) filter.country = new RegExp(country, 'i');
    if (browser) filter.browser = new RegExp(browser, 'i');
    if (search) {
      filter.$or = [
        { country: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
        { browser: new RegExp(search, 'i') },
        { os: new RegExp(search, 'i') },
        { ip: new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? -1 : 1;

    const [visitors, total] = await Promise.all([
      Visitor.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Visitor.countDocuments(filter),
    ]);

    // Check for "live" visitors (active in last 5 minutes)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const liveCount = await Visitor.countDocuments({
      sessionEnd: null,
      sessionStart: { $gte: fiveMinAgo },
    });

    return res.status(200).json({
      visitors,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      liveCount,
    });
  } catch (err) {
    console.error('Visitors error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

