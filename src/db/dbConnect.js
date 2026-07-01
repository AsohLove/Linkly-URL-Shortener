import pg from 'pg'
import dotenv from 'dotenv'
import { config } from '../config.js'

dotenv.config({
    path: config.env === "test" 
        ? ".env.test"
        : ".env"
})

const { Pool } = pg



export const pool = new Pool({
    connectionString: config.databaseUrl
})

