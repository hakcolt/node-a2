import { Response, Router } from "express"
import { Result } from "../../application/shared/useCases/Result"
import { settings } from "../../application/shared/settings/AppSettings"


export abstract class BaseController {
  abstract initializeRoutes(router: Router): void

  handleResult(res: Response, result: Result<any>) {
    const error = result.error as Error
    if (error) {
      if (settings.Server.Mode === settings.Mode.Development) console.log(error.message, "\n", error.stack)
      result.error = error.message
    }
    res.status(result.statusCode).json(result)
  }
}