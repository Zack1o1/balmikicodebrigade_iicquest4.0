/**
 * Seed script: Creates tables and inserts sample users.
 * Usage: node database/seed.js
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'smartpalika',
});

const USERS = [
  {
    name: 'Ram Sharma',
    email: 'ram.customer@palika.gov.np',
    password: 'Password123!',
    role: 'customer',
  },
  {
    name: 'Sita Poudel',
    email: 'sita.staff@palika.gov.np',
    password: 'Password123!',
    role: 'staff',
  },
  {
    name: 'Admin User',
    email: 'admin@palika.gov.np',
    password: 'Password123!',
    role: 'admin',
  },
];

async function seed() {
  try {
    const fs = require('fs');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Schema created.');

    for (const u of USERS) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(u.password, salt);
      await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password`,
        [u.name, u.email, hash, u.role]
      );
      console.log(`  ✓ ${u.role}: ${u.email}`);
    }

    console.log('\nSeed complete. Test credentials:');
    console.log('  Customer: ram.customer@palika.gov.np / Password123!');
    console.log('  Staff:    sita.staff@palika.gov.np   / Password123!');
    console.log('  Admin:    admin@palika.gov.np        / Password123!');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
