import { AccessToken, ISessionInput } from "../../../../domain/session/AccessToken"

export interface IAuthProvider {
  decodeJWT(token: string): ISessionInput
  getJWT(input: ISessionInput, refreshToken: boolean): AccessToken 
  verifyJWT(token: string, refreshToken: boolean): boolean
  encryptPassword(password: string): string
  auth(password: string, passwordEncrypted: string): boolean
}