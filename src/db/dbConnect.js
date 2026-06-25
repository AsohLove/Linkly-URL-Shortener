import pg from 'pg'
import dotenv from 'dotenv'
import { connectionString } from 'pg/lib/defaults'

dotenv.config()

const { Pool } = pg

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

