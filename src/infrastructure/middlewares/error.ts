import { NextFunction, Request, Response } from "express"
import { Result } from "../../application/shared/useCases/Result"

export function errorHandler(e: Error, req: Request, res: Response, next: NextFunction) {
  if (!e) return
  console.log("Uncaught error: ", e.message)
  console.log(e.stack)
  const result = new Result()
  result.setError("Internal Error", 500)
  res.status(result.statusCode).json(result)
}