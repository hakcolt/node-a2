import { IAuthProvider } from "../../application/modules/users/providerContracts/IAuth.provider"
import jwt from "jsonwebtoken"
import { AppSettings } from "../../application/shared/settings/AppSettings"
import { ISession, ISessionInput } from "../../domain/session/ISession"
import bcrypt from "bcrypt"

export class AuthProvider implements IAuthProvider {
  encryptPassword(data: string): string {
    return bcrypt.hashSync(data, 10)
  }

  auth(password: string, passwordEncrypted: string): boolean {
    return bcrypt.compareSync(password, passwordEncrypted)
  }

  getJWT({ uid, email }: ISessionInput, longSession: boolean): ISession {
    const expirationTime = longSession ? AppSettings.JWT_LONG_SESSION_TIME : AppSettings.JWT_REFRESH_SESSION_TIME
    const token = jwt.sign({ uid, email }, longSession ? AppSettings.JWT_LONG_SESSION_KEY : AppSettings.JWT_REFRESH_SESSION_KEY, {
      expiresIn: expirationTime
    })

    const expiresAt = new Date()
    expiresAt.setTime(expiresAt.getTime() + expirationTime * 1000)

    return {
      email,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    }
  }

  verifyJWT(token: string, longSession: boolean): boolean {
    try {
      return !!jwt.verify(token, longSession ? AppSettings.JWT_LONG_SESSION_KEY : AppSettings.JWT_REFRESH_SESSION_KEY)
    } catch (e) { return false }
  }

  decodeJWT(token: string): ISessionInput {
    return jwt.decode(token) as ISessionInput
  }

}