const { logger } = require("../utils/logger");

function errorHandler(err, _req, res, _next) {
  const statusCode = Number(err?.statusCode || err?.status || 500);
  const message = err?.message || "Internal Server Error";

  if (statusCode >= 500) {
    logger.error(err);
  } else {
    logger.warn(message);
  }

  res.status(statusCode).json({ error: message });
}

module.exports = { errorHandler };

