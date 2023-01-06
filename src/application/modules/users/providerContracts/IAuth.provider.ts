import { ISession, ISessionInput } from "../../../../domain/session/ISession"

export interface IAuthProvider {
  decodeJWT(token: string): ISessionInput
  getJWT(input: ISessionInput, longSession: boolean): ISession 
  verifyJWT(token: string, longSession: boolean): boolean
  encryptPassword(password: string): string
  auth(password: string, passwordEncrypted: string): boolean
}