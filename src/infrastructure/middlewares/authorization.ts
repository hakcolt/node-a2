import { NextFunction, Request, Response } from "express"
import { IRequest } from "../../adapters/base/Base.controller"
import { AuthProvider } from "../../adapters/providers/Auth.provider"
import { ApplicationError } from "../../application/shared/errors/ApplicationError"
import { strings } from "../../application/shared/locals"

const whiteList = [
  "/users/login",
  "/users/signup",
  "/users/logout"
]

export function verifyToken(request: Request, res: Response, next: NextFunction) {
  const req = request as IRequest

  const isWhiteList = whiteList.some(path => path == req.path)
  if (isWhiteList) return next()

  const authorization: string | undefined = req.headers.authorization
  const authorizationParts = authorization?.split(/\s/)

  if (authorizationParts?.length === 2) {
    const tokenType = authorizationParts?.at(0)
    const token = authorizationParts?.at(1)

    const auth = new AuthProvider()
    if (tokenType === "Bearer" && token && auth.verifyJWT(token, false)) return next()
  }
  next(new ApplicationError(req.resources.get(strings.UNAUTHORIZED), 401))
}