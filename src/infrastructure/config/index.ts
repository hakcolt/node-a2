import "dotenv/config"

const nodeEnv = process.env.NODE_ENV

if (!nodeEnv || nodeEnv === "development") console.log("Running in dev mode")

export default {
  Server: {
    Mode: nodeEnv || "development",
    ApiPath: process.env.SERVER_API_PATH || "/api",
    Host: process.env.SERVER_HOST || "localhost",
    Port: process.env.SERVER_PORT || 3000,
    Origins:
      (process.env.ORIGINS || "http://localhost:3100")
        .replace(/\s/, "")
        .split(",")
  },
  Security: {
    JWT: {
      RefreshToken: {
        SecretKey: process.env.JWT_REFRESH_TOKEN_KEY || "1234",
        ExpiresInSeconds: parseInt(process.env.JWT_REFRESH_TOKEN_TIME_IN_SECONDS as string) || 2592000
      },
      AccessToken: {
        SecretKey: process.env.JWT_ACCESS_TOKEN_KEY || "1234",
        ExpiresInSeconds: parseInt(process.env.JWT_ACCESS_TOKEN_TIME_IN_SECONDS as string) || 3600
      }
    }
  }
}