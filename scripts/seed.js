import { readFileSync } from 'node:fs';
import { pool } from '../src/db/dbConnect.js';

const seed = readFileSync(new URL("../db/seed.sql", import.meta.url), "utf8");

await pool.query(seed);

console.log("✅ Database seeded successfully(Dummy links and clicks)!!");
await pool.end()