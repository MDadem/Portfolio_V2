/**
 * Local development server for API routes.
 * Run with: node api/dev-server.js
 * This mimics Vercel serverless functions locally.
 */
import express from 'express';
import { config } from 'dotenv';

config(); // Load .env

const app = express();
app.use(express.json());

// Dynamically load route handlers
async function loadHandler(path) {
  const module = await import(path);
  return module.default;
}

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const handler = await loadHandler('./auth/login.js');
  await handler(req, res);
});

app.get('/api/auth/verify', async (req, res) => {
  const handler = await loadHandler('./auth/verify.js');
  await handler(req, res);
});

app.post('/api/auth/logout', async (req, res) => {
  const handler = await loadHandler('./auth/logout.js');
  await handler(req, res);
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const handler = await loadHandler('./auth/forgot-password.js');
  await handler(req, res);
});

app.post('/api/auth/reset-password', async (req, res) => {
  const handler = await loadHandler('./auth/reset-password.js');
  await handler(req, res);
});

// Tracking
app.post('/api/track', async (req, res) => {
  const handler = await loadHandler('./track.js');
  await handler(req, res);
});

app.options('/api/track', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

// Panel routes
app.get('/api/panel/visitors', async (req, res) => {
  const handler = await loadHandler('./panel/visitors.js');
  await handler(req, res);
});

app.get('/api/panel/events', async (req, res) => {
  const handler = await loadHandler('./panel/events.js');
  await handler(req, res);
});

app.get('/api/panel/analytics', async (req, res) => {
  const handler = await loadHandler('./panel/analytics.js');
  await handler(req, res);
});

app.get('/api/panel/settings', async (req, res) => {
  const handler = await loadHandler('./panel/settings.js');
  await handler(req, res);
});

app.post('/api/panel/settings', async (req, res) => {
  const handler = await loadHandler('./panel/settings.js');
  await handler(req, res);
});

app.get('/api/panel/map-data', async (req, res) => {
  const handler = await loadHandler('./panel/map-data.js');
  await handler(req, res);
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`[API] Dev server running on http://localhost:${PORT}`);
  console.log(`[API] Make sure .env is configured and MongoDB is accessible`);
});
