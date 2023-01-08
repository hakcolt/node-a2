import { NextFunction, Request, Response } from "express"
import { ApplicationError } from "../../application/shared/errors/ApplicationError"
import { Result } from "../../application/shared/useCases/BaseUseCase"

export function errorHandler(e: Error, req: Request, res: Response, next: NextFunction) {
  if (!e) return
  if (e instanceof ApplicationError) handleError(res, e)
  else handleNodeError(res, e)
}

function handleError(res: Response, e: ApplicationError) {
  const result = new Result()
  result.setError(e.message, e.statusCode)
  res.status(result.statusCode).json(result)
}

function handleNodeError(res: Response, e: Error) {
  console.log("Uncaught error: ", e.message)
  console.log(e.stack)
  const result = new Result()
  result.setError("Internal Error", 500)
  res.status(result.statusCode).json(result)
}