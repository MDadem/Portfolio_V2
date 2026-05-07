import { connectDB } from '../lib/db.js';
import { verifyToken } from '../lib/auth.js';
import Visitor from '../lib/models/Visitor.js';
import Event from '../lib/models/Event.js';

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalVisitors,
      uniqueVisitors,
      todayVisitors,
      cvDownloads,
      cvPreviews,
      avgSessionResult,
      topCountries,
      topBrowsers,
      topReferrers,
      deviceTypes,
      eventFrequency,
      dailyVisitors,
      hourlyHeatmap,
    ] = await Promise.all([
      // Total visits
      Visitor.countDocuments(),
      // Unique visitors
      Visitor.distinct('visitorId').then(ids => ids.length),
      // Today's visitors
      Visitor.countDocuments({ createdAt: { $gte: todayStart } }),
      // CV Downloads
      Event.countDocuments({ eventName: 'cv_downloaded' }),
      // CV Previews
      Event.countDocuments({ eventName: 'cv_previewed' }),
      // Average session duration
      Visitor.aggregate([
        { $match: { sessionDuration: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: '$sessionDuration' } } },
      ]),
      // Top countries
      Visitor.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Top browsers
      Visitor.aggregate([
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      // Top referrers
      Visitor.aggregate([
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      // Device types
      Visitor.aggregate([
        { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Event frequency (top events)
      Event.aggregate([
        { $group: { _id: '$eventName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),
      // Daily visitors (last 30 days)
      Visitor.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Hourly heatmap (hour × day of week)
      Visitor.aggregate([
        {
          $group: {
            _id: {
              hour: { $hour: '$createdAt' },
              dayOfWeek: { $dayOfWeek: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.dayOfWeek': 1, '_id.hour': 1 } },
      ]),
    ]);

    const avgSession = avgSessionResult.length > 0 ? Math.round(avgSessionResult[0].avg) : 0;

    return res.status(200).json({
      overview: {
        totalVisitors,
        uniqueVisitors,
        todayVisitors,
        cvDownloads,
        cvPreviews,
        avgSessionDuration: avgSession,
        topCountry: topCountries[0]?._id || 'N/A',
        topBrowser: topBrowsers[0]?._id || 'N/A',
        topReferrer: topReferrers[0]?._id || 'N/A',
      },
      charts: {
        topCountries,
        topBrowsers,
        topReferrers,
        deviceTypes,
        eventFrequency,
        dailyVisitors,
        hourlyHeatmap,
      },
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
