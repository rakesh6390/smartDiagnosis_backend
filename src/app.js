const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { env } = require("./config/env");
const { rateLimiter } = require("./middleware/rateLimiter");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

const diagnosisRoutes = require("./routes/diagnosisRoutes");
const historyRoutes = require("./routes/historyRoutes");

function createApp() {
  const app = express();

  // Major step: baseline security + request parsing.
  app.use(helmet());
  app.use(cors());

  // Major step: logging for observability.
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  // Major step: rate limiting.
  app.use(rateLimiter);

  // Major step: JSON parsing with a safe limit.
  app.use(express.json({ limit: "100kb" }));

  // Health check.
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Routes.
  app.use("/diagnose", diagnosisRoutes);
  app.use("/history", historyRoutes);

  // 404 + error middleware.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

