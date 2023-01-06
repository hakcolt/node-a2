import { NextFunction, Request, Response } from "express"
import { Result } from "../../application/shared/useCases/Result"


export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  const result = new Result()
  result.setError("Page not found. Verify the request method, the url and try again.", 404)
  Object.defineProperties(result, {
    method: { value: req.method },
    endPoint: { value: req.path }
  })
  res.status(result.statusCode).json({
    statusCode: result.statusCode,
    error: result.error,
    isSucess: result.isSucess,
    method: req.method,
    url: req.url
  })
}