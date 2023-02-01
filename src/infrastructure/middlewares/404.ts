import { NextFunction, Request, Response } from "express"
import { IRequest } from "../../adapters/base/Base.controller"
import { strings } from "../../application/shared/locals"
import { Result } from "../../application/shared/useCases/BaseUseCase"
import config from "../config"


export function notFoundMiddleware(request: Request, res: Response, next: NextFunction) {
  const req = request as IRequest

  const result = new Result()
  result.setError(req.resources.get(strings.PAGE_NOT_FOUND), 404)
  res.status(result.statusCode).json({
    ...result,
    method: req.method,
    path: config.Server.ApiPath + req.path
  })
}