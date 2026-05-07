import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, index: true },
  ip: { type: String },
  ipHash: { type: String },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  region: { type: String, default: '' },
  latitude: { type: Number },
  longitude: { type: Number },
  browser: { type: String, default: 'Unknown' },
  browserVersion: { type: String, default: '' },
  os: { type: String, default: 'Unknown' },
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet', 'unknown'], default: 'unknown' },
  referrer: { type: String, default: 'direct' },
  userAgent: { type: String },
  sessionId: { type: String, index: true },
  sessionStart: { type: Date, default: Date.now },
  sessionEnd: { type: Date },
  sessionDuration: { type: Number, default: 0 },
  pagesVisited: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

VisitorSchema.index({ createdAt: -1 });
VisitorSchema.index({ country: 1 });
VisitorSchema.index({ sessionStart: -1 });

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
