const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const outPath = path.join(__dirname, 'config.js');

const keys = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID',
];

// Load from .env file if it exists (local dev)
const fileEnv = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .forEach(line => {
      const [key, ...rest] = line.split('=');
      fileEnv[key.trim()] = rest.join('=').trim();
    });
}

// System env vars (Netlify) take priority, then .env file
const env = {};
for (const key of keys) {
  env[key] = process.env[key] || fileEnv[key] || '';
}

const entries = Object.entries(env)
  .map(([k, v]) => `  ${k}: "${v}",`)
  .join('\n');

const content = `// This file is auto-generated — do not edit or commit.
const ENV = {
${entries}
};
`;

fs.writeFileSync(outPath, content, 'utf-8');
console.log('config.js generated successfully');
