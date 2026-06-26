import { createServer } from 'node:http'
import app from "./app.js"
import { pool } from './db/dbConnect.js'

const PORT = process.env.PORT || 3000

const server = createServer(app)

server.listen(PORT, () => {
    console.log(`URL_Shortener running on http://localhost:${PORT}`)
})

