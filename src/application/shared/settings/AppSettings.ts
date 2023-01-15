export class AppSettings {
  static JWT_REFRESH_TOKEN_KEY: string
  static JWT_REFRESH_TOKEN_TIME: number
  static JWT_ACCESS_TOKEN_KEY: string
  static JWT_ACCESS_TOKEN_TIME: number
  static SERVER_MODE: string
  static SERVER_PORT: string
  static SERVER_HOST: string
  static SERVER_ROOT: string
  static SERVER_ORIGINS: string[]

  static init(configs: Record<string, any>) {
    this.JWT_REFRESH_TOKEN_KEY = configs.Security.JWT.RefreshToken.SecretKey
    this.JWT_REFRESH_TOKEN_TIME = configs.Security.JWT.RefreshToken.ExpiresInSeconds
    this.JWT_ACCESS_TOKEN_KEY = configs.Security.JWT.AccessToken.SecretKey
    this.JWT_ACCESS_TOKEN_TIME = configs.Security.JWT.AccessToken.ExpiresInSeconds
    this.SERVER_MODE = configs.Server.Mode
    this.SERVER_PORT = configs.Server.Port
    this.SERVER_HOST = configs.Server.Host
    this.SERVER_ROOT = configs.Server.Root
    this.SERVER_ORIGINS = configs.Server.Origins
  }
}
