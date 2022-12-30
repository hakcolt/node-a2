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
      SecretKey: process.env.JWT_SECRET_KEY,
      ExpireInSeconds: 3600
    }
  }
}