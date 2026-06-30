import express from "express"

import docsRouter from "./routes/docs-route.js"
import linksRouter from './routes/links-routes.js'
import redirectRouter from './routes/redirect-routes.js'
import authRouter from './routes/auth-routes.js'

import createError from "http-errors"
import pinoHttp from 'pino-http'
import helmet from "helmet"
import cors from "cors";
import rateLimit from "express-rate-limit"


export function createApp() {

  const app = express()

  app.use(helmet({ contentSecurityPolicy: false }))

  app.use(cors())

  app.use(pinoHttp())

  app.use(express.json())

  app.get("/health", (req, res) => {
      res.json({ status: "OK" })
      })

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 100,
      max: 100,
      standardHeaders: true
    })
  )

  app.use("/docs", docsRouter);

  app.use('/auth', authRouter);

  app.use('/links', linksRouter);


  app.use('/', redirectRouter);



  app.use((req, res, next) => {
    next(createError(404, "Route not found"))
  })

  app.use((err, req, res, next) => {
    res.status(err.status || 500 ).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
  });

  return app;

}
