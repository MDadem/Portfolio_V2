import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const ADMIN_EMAIL = 'miladiadem58@gmail.com';
const ADMIN_PASSWORD = process.argv[2] || '55366059MDadem';
const SALT_ROUNDS = 12;

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in .env file');
    console.log('\nCreate a .env file with:');
    console.log(`MONGODB_URI=mongodb+srv://miladiadem58_db_user:55366059@algoarenadb.uttfcy0.mongodb.net/Portfolio?appName=AlgoArenaDB`);
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    console.log(`JWT_SECRET=${jwtSecret}`);
    console.log(`GMAIL_USER=miladiadem58@gmail.com`);
    console.log(`GMAIL_APP_PASSWORD=your_app_password`);
    console.log(`TRACKING_ENABLED=true`);
    process.exit(1);
  }

  console.log('=== Portfolio Panel — Admin Seeder ===\n');
  console.log(`Connecting to MongoDB...`);

  await mongoose.connect(uri, { dbName: 'Portfolio' });
  console.log('✅ Connected to Portfolio database\n');

  const Admin = mongoose.model('Admin', AdminSchema);

  // Check if admin already exists
  const existing = await Admin.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin "${ADMIN_EMAIL}" already exists. Updating password...`);
    existing.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    existing.updatedAt = new Date();
    await existing.save();
    console.log('✅ Password updated!\n');
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    await Admin.create({ email: ADMIN_EMAIL, passwordHash: hash });
    console.log(`✅ Admin created: ${ADMIN_EMAIL}\n`);
  }

  // Generate JWT secret if needed
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  console.log('=== Make sure your .env has these values ===\n');
  console.log(`MONGODB_URI=${uri}`);
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log(`GMAIL_USER=${ADMIN_EMAIL}`);
  console.log(`GMAIL_APP_PASSWORD=your_gmail_app_password`);
  console.log(`TRACKING_ENABLED=true`);
  console.log('\n⚠️  NEVER commit the .env file.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
