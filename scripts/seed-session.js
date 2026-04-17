// Seeds a NextAuth user + session directly in MongoDB for E2E testing.
// Usage: MONGODB_URI=... node scripts/seed-session.js
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const [, key, rawValue] = m;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

loadEnvFile(path.join(__dirname, '..', 'client', '.env.local'));
loadEnvFile(path.join(__dirname, '..', 'server', '.env'));

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error('MONGODB_URI is required (set it in client/.env.local, server/.env, or the shell)');
  process.exit(1);
}

(async () => {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db('test');

  const userId = new ObjectId();
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.collection('users').insertOne({
    _id: userId,
    name: 'E2E Tester',
    email: 'e2e@test.local',
    image: null,
    emailVerified: null,
  });

  await db.collection('sessions').insertOne({
    _id: new ObjectId(),
    sessionToken,
    userId,
    expires,
  });

  console.log(JSON.stringify({ userId: userId.toString(), sessionToken, expires: expires.toISOString() }));
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
