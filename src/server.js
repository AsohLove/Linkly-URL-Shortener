import { createServer } from 'node:http'
import { createApp } from "./app.js"
import { pool } from './db/dbConnect.js'
import { logger } from './lib/logger.js'

const PORT = process.env.PORT || 3000

const app = createApp()

app.listen(PORT, () => {
    logger.info(`URL_Shortener running on http://localhost:${PORT}`)
})

