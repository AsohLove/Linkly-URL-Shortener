import express from "express"

import docsRouter from "./routes/docs-route.js"
import linksRoutes from './routes/links-routes.js'

import createError from "http-errors"

const app = express()

app.use(express.json())

app.get("/health", (req, res) => {
    res.json({ status: "OK" })
})

app.use("/docs", docsRouter)

app.use('/links', linksRoutes);


app.use((req, res, next) => {
    next(createError(404, "Route not found"))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500 ).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});



export default app