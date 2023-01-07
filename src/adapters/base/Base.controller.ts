import { Result, ResultData } from "../../application/shared/useCases/BaseUseCase"
import { INextFunction } from "./context/INextFunction"
import { IResponse } from "./context/IResponse"
import { IRequest } from "./context/IResquest"
import { IRouter } from "./context/IRouter"

type EntryPointHandler = (req: IRequest, res: IResponse, next: INextFunction) => Promise<void>;

export { IRouter, EntryPointHandler, IRequest, IResponse, INextFunction }

export abstract class BaseController {
  abstract initializeRoutes(router: IRouter): void

  getResultToResponse(res: IResponse, result: Result): Result {
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

  async handleResult(res: IResponse, next: INextFunction, useCase: Promise<Result>) {
    try {
      let result = await useCase

      const resultUpdated = this.getResultToResponse(res, result)
      res.status(resultUpdated.statusCode).json(resultUpdated)
    } catch (e) { next(e) }
  }

  async handleMiddleware(res: IResponse, next: INextFunction, useCase: Promise<Result>) {
    try {
      let result = await useCase

      if (result.isSucess) {
        const resultUpdated = this.getResultToResponse(res, result)
        res.status(resultUpdated.statusCode).json(resultUpdated)
      } else next()
    } catch (e) { next(e) }
  }
}