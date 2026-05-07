import mongoose from 'mongoose';

const LoginAttemptSchema = new mongoose.Schema({
  ip: { type: String, required: true, index: true },
  success: { type: Boolean, default: false },
  email: { type: String },
  timestamp: { type: Date, default: Date.now },
});

LoginAttemptSchema.index({ ip: 1, timestamp: -1 });
LoginAttemptSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.models.LoginAttempt || mongoose.model('LoginAttempt', LoginAttemptSchema);

