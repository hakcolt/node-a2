import { ISession } from "../../../domain/session/ISession"
import jwt from "jsonwebtoken"
import { settings } from "../settings/AppSettings"

export class SessionUtil {
  createSession(user: any): ISession {
    const expiresInSeconds = settings.JWT.ExpireInSeconds
    const createdAt =  new Date()
    const expiresIn =  new Date()
    expiresIn.setTime(createdAt.getTime() + expiresInSeconds * 1000)
    const tokenKey = settings.JWT.SecretKey
    if (!tokenKey) { 
      console.log("TODO: Error")
      return undefined
     } 
    return {
      token: jwt.sign(user, tokenKey),
      email: user.email,
      createdAt: createdAt.toISOString(),
      expireAt: expiresIn.toISOString()
    }
  }
}

export default new SessionUtil()