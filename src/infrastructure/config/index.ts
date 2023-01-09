import "dotenv/config"

const nodeEnv = process.env.NODE_ENV

if (!nodeEnv || nodeEnv === "development") console.log("Running in dev mode")

export default {
  Server: {
    Mode: nodeEnv || "development",
    Root: process.env.SERVER_ROOT || "/api",
    Host: process.env.SERVER_HOST || "localhost",
    Port: process.env.SERVER_PORT || 3000,
    Origins:
      (process.env.ORIGINS || "http://localhost:3100")
        .replace(/\s/, "")
        .split(",")
  },
  Security: {
    JWT: {
      LongSession: {
        SecretKey: process.env.JWT_LONG_SESSION_KEY || "1234",
        ExpiresInSeconds: parseInt(process.env.JWT_LONG_SESSION_TIME_IN_SECONDS as string) || 604800
      },
      RefreshSession: {
        SecretKey: process.env.JWT_REFRESH_SESSION_KEY || "1234",
        ExpiresInSeconds: parseInt(process.env.JWT_REFRESH_SESSION_TIME_IN_SECONDS as string) || 21600
      }
    }
  }
}