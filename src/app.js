import express from "express"

import { mountDocs } from "./routes/docs-route.js"
import linksRouter from './routes/links-routes.js'
import redirectRouter from './routes/redirect-routes.js'
import authRouter from './routes/auth-routes.js'

import createError from "http-errors"
import pinoHttp from 'pino-http'
import helmet from "helmet"
import cors from "cors";
import rateLimit from "express-rate-limit"
import { config } from "./config.js"


export function createApp() {

  const app = express()

  app.set('trust proxy', 1)

  app.use(helmet({ contentSecurityPolicy: false }))

  app.use(cors())

  app.use(pinoHttp())

  app.use(express.json())

  app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        name: "Linkly URL Shortener API",
        version: "1.0.0",
        description:
            "A REST API for shortening URLs, tracking clicks, and managing links.",
        docs: "/docs",
        health: "/health"
    });
  });

  app.get("/health", (req, res) => {
      res.json({ status: "OK" })
      })

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true
    })
  )

  mountDocs(app)

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
