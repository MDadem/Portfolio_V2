import { connectDB } from './lib/db.js';
import Visitor from './lib/models/Visitor.js';
import Event from './lib/models/Event.js';
import { geolocateIP } from './lib/geolocate.js';
import { parseUserAgent } from './lib/parseUserAgent.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS headers for tracking from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check kill switch
  if (process.env.TRACKING_ENABLED === 'false') {
    return res.status(200).json({ tracked: false, reason: 'tracking_disabled' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // Check IP whitelist
  const whitelist = (process.env.WHITELIST_IPS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (whitelist.includes(ip)) {
    return res.status(200).json({ tracked: false, reason: 'whitelisted' });
  }

  const { type, visitorId, sessionId, eventName, eventLabel, metadata, referrer } = req.body || {};

  if (!visitorId) {
    return res.status(400).json({ error: 'visitorId is required' });
  }

  try {
    await connectDB();

    // Hash IP for storage (anonymize)
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
    // Mask IP for display: keep first 3 octets
    const maskedIp = ip.split('.').slice(0, 3).join('.') + '.xxx';

    if (type === 'session_start') {
      const ua = req.headers['user-agent'] || '';
      const { browser, browserVersion, os, deviceType } = parseUserAgent(ua);
      const geo = await geolocateIP(ip);

      await Visitor.create({
        visitorId,
        ip: maskedIp,
        ipHash,
        country: geo.country,
        city: geo.city,
        region: geo.region,
        latitude: geo.latitude,
        longitude: geo.longitude,
        browser,
        browserVersion,
        os,
        deviceType,
        referrer: referrer || 'direct',
        userAgent: ua,
        sessionId,
        sessionStart: new Date(),
        pagesVisited: [],
      });

      // Also record page_view event
      await Event.create({
        visitorId,
        eventName: 'page_view',
        eventLabel: 'Initial page load',
        metadata: { referrer: referrer || 'direct' },
        ip: maskedIp,
        sessionId,
      });

      return res.status(200).json({ tracked: true });
    }

    if (type === 'event') {
      if (!eventName) {
        return res.status(400).json({ error: 'eventName is required for event type' });
      }

      await Event.create({
        visitorId,
        eventName,
        eventLabel: eventLabel || '',
        metadata: metadata || {},
        ip: maskedIp,
        sessionId,
      });

      // If section_viewed, update pagesVisited
      if (eventName === 'section_viewed' && metadata?.section) {
        await Visitor.updateOne(
          { visitorId, sessionId },
          { $addToSet: { pagesVisited: metadata.section } }
        );
      }

      return res.status(200).json({ tracked: true });
    }

    if (type === 'session_end') {
      const { duration } = req.body;
      await Visitor.updateOne(
        { visitorId, sessionId },
        { 
          sessionEnd: new Date(), 
          sessionDuration: duration || 0 
        }
      );
      return res.status(200).json({ tracked: true });
    }

    if (type === 'heartbeat') {
      const { duration } = req.body;
      await Visitor.updateOne(
        { visitorId, sessionId },
        { 
          sessionEnd: new Date(), 
          sessionDuration: duration || 0 
        }
      );
      return res.status(200).json({ tracked: true });
    }

    return res.status(400).json({ error: 'Invalid type. Use: session_start, event, session_end, heartbeat' });
  } catch (err) {
    console.error('Track error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
