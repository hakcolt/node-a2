import { NextFunction, Response, Router } from "express"
import { Result, ResultData } from "../../application/shared/useCases/Result"


export abstract class BaseController {
  abstract initializeRoutes(router: Router): void

  getResultToResponse(res: Response, result: Result): Result {
    if (result.isSucess && result instanceof ResultData && result.cookie) {
      const cookie = result.cookie
      res.cookie(cookie.name, cookie.value)

      const tempResult = new ResultData()
      tempResult.setMessage(result.message, result.statusCode)
      tempResult.data = result.data
      result = tempResult
    }
    return result
  }

  async handleResult(res: Response, next: NextFunction, useCase: Promise<Result>) {
    try {
      let result = await useCase

      const resultUpdated = this.getResultToResponse(res, result)
      res.status(resultUpdated.statusCode).json(resultUpdated)
    } catch (e) { next(e) }
  }

  async handleMiddleware(res: Response, next: NextFunction, useCase: Promise<Result>) {
    try {
      let result = await useCase

      if (result.isSucess) {
        const resultUpdated = this.getResultToResponse(res, result)
        res.status(resultUpdated.statusCode).json(resultUpdated)
      } else next()
    } catch (e) { next(e) }
  }
}