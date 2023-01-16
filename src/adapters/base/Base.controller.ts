import { NextFunction, Request, Response, Router } from "express"
import { Result, ResultData } from "../../application/shared/useCases/BaseUseCase"
import { IRequest } from "./context/IRequest"

export { IRequest }

export abstract class BaseController {
  abstract initializeRoutes(router: Router): void

  getResultToResponse(res: Response, result: Result): Result {
    if (result.isSuccess && result instanceof ResultData) {
      const cookie = result.cookie
      if (cookie) {
        res.cookie(cookie.name, cookie.value, {
          expires: cookie.expires,
          sameSite: "none",
          httpOnly: true,
          secure: true
        })
      }

      const tempResult = new ResultData()
      tempResult.setMessage(result.message, result.statusCode, result.next)

      const data = result.data
      if (data) tempResult.data = data

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
}