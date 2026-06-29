import express from "express"

import docsRouter from "./routes/docs-route.js"
import linksRouter from './routes/links-routes.js'
import redirectRouter from './routes/redirect-routes.js'
import authRouter from './routes/links-routes.js'

import createError from "http-errors"

export function createApp() {

  const app = express()

  app.use(express.json())

  app.get("/health", (req, res) => {
      res.json({ status: "OK" })
      })

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
