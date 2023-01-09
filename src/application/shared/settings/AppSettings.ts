export class AppSettings {
  static JWT_LONG_SESSION_KEY: string
  static JWT_LONG_SESSION_TIME: number
  static JWT_REFRESH_SESSION_KEY: string
  static JWT_REFRESH_SESSION_TIME: number
  static SERVER_MODE: string
  static SERVER_PORT: string
  static SERVER_HOST: string
  static SERVER_ROOT: string
  static SERVER_ORIGINS: string[]

  static init(configs: Record<string, any>) {
    this.JWT_LONG_SESSION_KEY = configs.Security.JWT.LongSession.SecretKey
    this.JWT_LONG_SESSION_TIME = configs.Security.JWT.LongSession.ExpiresInSeconds
    this.JWT_REFRESH_SESSION_KEY = configs.Security.JWT.RefreshSession.SecretKey
    this.JWT_REFRESH_SESSION_TIME = configs.Security.JWT.RefreshSession.ExpiresInSeconds
    this.SERVER_MODE = configs.Server.Mode
    this.SERVER_PORT = configs.Server.Port
    this.SERVER_HOST = configs.Server.Host
    this.SERVER_ROOT = configs.Server.Root
    this.SERVER_ORIGINS = configs.Server.Origins
  }
}
