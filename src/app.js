import express from "express"
import docsRouter from "./routes/docs-route.js"

const app = express()

app.use(express.json())

app.get("/health", (req, res) => {
    res.json({ status: "OK" })
})

app.use("/docs", docsRouter)

export default app