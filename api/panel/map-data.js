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

    const { country } = req.query;

    if (country) {
      // Get visitors from a specific country
      const visitors = await Visitor.find({ country: new RegExp(country, 'i') })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();
      return res.status(200).json({ visitors });
    }

    // Get country aggregation with coordinates
    const countryData = await Visitor.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          lat: { $first: '$latitude' },
          lng: { $first: '$longitude' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({ countries: countryData });
  } catch (err) {
    console.error('Map data error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

