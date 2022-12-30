import configs from "../../../infrastructure/config"

export const settings = {
  JWT: {
    SecretKey: configs.Security.JWT.SecretKey,
    ExpireInSeconds: configs.Security.JWT.ExpireInSeconds
  },
  Server: {
    Mode: configs.Server.Mode,
    Port: configs.Server.Port,
    Host: configs.Server.Host,
    Root: configs.Server.Root
  },
  Mode: {
    Development: "development",
    Prodution: "prodution"
  }
}