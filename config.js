const getEnv = (key, defaultValue) => {
  try {
    const value = process.env[key];
    return value === undefined || value === "" ? defaultValue : value;
  } catch (err) {
    console.error(`getEnv error for ${key}:`, err);
    return defaultValue;
  }
};

const MONGO_CONNECTION_TYPE = getEnv("MONGO_CONNECTION_TYPE", "local");
const MONGO_CONNECTION_URI = getEnv(
  "MONGO_CONNECTION_URI",
  "mongodb://127.0.0.1:27017/GeneralDB"
);
const MONGO_CONNECTION_URI_LOCAL = getEnv(
  "MONGO_CONNECTION_URI_LOCAL",
  "mongodb://127.0.0.1:27017/GeneralDB"
);

module.exports = {
  MONGO_CONNECTION_TYPE,
  MONGO_CONNECTION_URI,
  MONGO_CONNECTION_URI_LOCAL,
};
