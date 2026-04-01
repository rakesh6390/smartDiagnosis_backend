const rateLimit = require("express-rate-limit");

const { env } = require("../config/env");

const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { rateLimiter };

