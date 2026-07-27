const isDev = process.env.NODE_ENV !== "production";

const logger = {
  info: (...args) => {
    if (isDev) console.log("[INFO]", ...args);
  },
  error: (...args) => {
    console.error("[ERROR]", ...args);
  },
  warn: (...args) => {
    console.warn("[WARN]", ...args);
  },
};

export default logger;
