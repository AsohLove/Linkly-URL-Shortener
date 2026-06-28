import { readFileSync } from 'node:fs'
import { pool } from '../src/db/dbConnect.js'


const schema = readFileSync(new URL('../db/schemas.sql', import.meta.url), 'utf8')

await pool.query(schema)
console.log('Migration Completed!!')
await pool.end()
