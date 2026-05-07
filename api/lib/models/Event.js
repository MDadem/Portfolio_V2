import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, index: true },
  eventName: { type: String, required: true, index: true },
  eventLabel: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ip: { type: String },
  sessionId: { type: String },
  timestamp: { type: Date, default: Date.now },
});

EventSchema.index({ timestamp: -1 });
EventSchema.index({ eventName: 1, timestamp: -1 });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
