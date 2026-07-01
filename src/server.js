import { createServer } from 'node:http'
import { createApp } from "./app.js"
import { pool } from './db/dbConnect.js'
import { logger } from './lib/logger.js'
import { config } from './config.js'


const app = createApp()

app.listen(config.port, () => {
    logger.info(`URL_Shortener running on http://localhost:${config.port}`)
})

