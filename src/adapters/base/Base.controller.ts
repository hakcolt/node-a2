import { NextFunction, Request, Response, Router } from "express"
import { Result, ResultData } from "../../application/shared/useCases/BaseUseCase"
import { IRequest } from "./context/IRequest"

export { IRequest }

export abstract class BaseController {
  abstract initializeRoutes(router: Router): void

  getResultToResponse(res: Response, result: Result): Result {
    if (result.isSucess && result instanceof ResultData) {
      const cookie = result.cookie
      if (cookie) res.cookie(cookie.name, cookie.value)

      const tempResult = new ResultData()
      tempResult.setMessage(result.message, result.statusCode, result.next)

      const data = result.data
      if(data) tempResult.data = data

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