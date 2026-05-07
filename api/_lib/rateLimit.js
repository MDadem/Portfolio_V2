import { connectDB } from './db.js';
import LoginAttempt from './models/LoginAttempt.js';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function checkRateLimit(ip) {
  await connectDB();
  
  const windowStart = new Date(Date.now() - WINDOW_MS);
  
  const attempts = await LoginAttempt.countDocuments({
    ip,
    timestamp: { $gte: windowStart },
    success: false,
  });

  return {
    allowed: attempts < MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - attempts),
    resetAt: new Date(Date.now() + WINDOW_MS),
  };
}

export async function recordLoginAttempt(ip, email, success) {
  await connectDB();
  await LoginAttempt.create({ ip, email, success });
}

