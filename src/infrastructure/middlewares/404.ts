import { NextFunction, Request, Response } from "express"
import { Result } from "../../application/shared/useCases/BaseUseCase"
import config from "../config"


export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  const result = new Result()
  result.setError("Page not found. Verify the request method and the path, and try again.", 404)
  res.status(result.statusCode).json({
    ...result,
    method: req.method,
    path: config.Server.Root + req.path
  })
}