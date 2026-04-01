const http = require("http");

const { createApp } = require("./app");
const { connectDB } = require("./config/db");
const { env } = require("./config/env");
const { logger } = require("./utils/logger");

async function start() {
  // Major step: load Express app and connect DB before listening.
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`Smart Diagnosis API listening on port ${env.PORT}`);
  });

  // Graceful shutdown for production readiness.
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down...`);
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});

