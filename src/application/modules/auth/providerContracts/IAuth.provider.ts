import { AccessToken } from "../../../../domain/session/AccessToken"
import { TokenArgs } from "../../../../domain/session/TokenArgs"

export interface IAuthProvider {
  decodeJWT(token: string): TokenArgs
  getJWT(input: TokenArgs, refreshToken: boolean): AccessToken 
  verifyJWT(token: string, refreshToken: boolean): boolean
  encryptPassword(password: string): string
  auth(password: string, passwordEncrypted: string): boolean
}