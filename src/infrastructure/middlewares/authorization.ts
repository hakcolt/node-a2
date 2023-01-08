import { NextFunction, Request, Response } from "express"
import { AuthProvider } from "../../adapters/providers/Auth.provider"
import { ApplicationError } from "../../application/shared/errors/ApplicationError"

const whiteList = [
  "/users/login",
  "/users/signup",
  "/users/logout"
]

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const isWhiteList = whiteList.some(path => path == req.path)
  if (isWhiteList) return next()

  const authorization: string | undefined = req.headers.authorization
  const authorizationParts = authorization?.split(/\s/)
  const token = authorizationParts?.at(1)

  const auth = new AuthProvider()
  if (!token || !auth.verifyJWT(token, false)) return next(new ApplicationError("Unauthorized", 401))
  next()
}