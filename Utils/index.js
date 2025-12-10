const mongoose = require("mongoose");
const config = require("../config");

const logger = console;

function attachConnectionListeners() {
  const conn = mongoose.connection;

  conn.on("connecting", () => logger.info("MongoDB: connecting"));
  conn.on("connected", () => logger.info("MongoDB: connected"));
  conn.on("disconnecting", () => logger.warn("MongoDB: disconnecting"));
  conn.on("disconnected", () => logger.warn("MongoDB: disconnected"));
  conn.on("reconnected", () => logger.info("MongoDB: reconnected"));
  conn.on("error", (err) => logger.error("MongoDB: connection error", err));
}

async function connectWithRetry({
  uri,
  options = {},
  retries = 5,
  baseDelayMs = 2000,
} = {}) {
  let attempt = 0;

  while (attempt < retries) {
    attempt++;
    try {
      await mongoose.connect(uri, options);
      return mongoose.connection;
    } catch (err) {
      logger.error(`MongoDB attempt ${attempt} failed: ${err.message}`);

      if (attempt >= retries) throw err;

      const delay = baseDelayMs * 2 ** (attempt - 1); // exponential backoff
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function connectToDatabase({
  retries = 5,
  baseDelayMs = 2000,
  options = {},
} = {}) {
  attachConnectionListeners();

  const rawConnectionString =
    config.MONGO_CONNECTION_TYPE === "local"
      ? config.MONGO_CONNECTION_URI_LOCAL
      : config.MONGO_CONNECTION_URI;

  const maskedConnectionString = rawConnectionString.replace(
    /\/\/.*@/,
    "//***:***@"
  );
  logger.info(`MongoDB: connecting to ${maskedConnectionString}`);

  const connectionOptions = Object.assign(
    {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    },
    options
  );

  try {
    await connectWithRetry({
      uri: rawConnectionString,
      options: connectionOptions,
      retries,
      baseDelayMs,
    });
  } catch (err) {
    logger.error("MongoDB: could not connect", err);
    throw err;
  }

  const handleGracefulShutdown = async () => {
    try {
      await mongoose.disconnect();
      logger.info("MongoDB: disconnected (graceful)");
      process.exit(0);
    } catch (err) {
      logger.error("MongoDB: error during disconnect", err);
      process.exit(1);
    }
  };

  process.once("SIGINT", handleGracefulShutdown);
  process.once("SIGTERM", handleGracefulShutdown);

  return mongoose.connection;
}

module.exports = { connectToDatabase, attachConnectionListeners };
