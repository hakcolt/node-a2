import "dotenv/config"

const nodeEnv = process.env.NODE_ENV

if (!nodeEnv || nodeEnv === "development") console.log("Running in dev mode")

export default {
  Server: {
    Mode: nodeEnv,
    Root: process.env.SERVER_ROOT || "/api",
    Host: process.env.SERVER_HOST || "localhost",
    Port: process.env.SERVER_PORT || 3000
  },
  Security: {
    JWT: {
      LongSession: {
        SecretKey: process.env.JWT_LONG_SESSION_KEY || "1234",
        ExpiresInSeconds: process.env.JWT_LONG_SESSION_TIME || 604800 // 7 Days
      },
      RefreshSession: {
        SecretKey: process.env.JWT_REFRESH_SESSION_KEY || "1234",
        ExpiresInSeconds: process.env.JWT_REFRESH_SESSION_TIME || 21600 // 6 Hours
      }
    }
  }
}