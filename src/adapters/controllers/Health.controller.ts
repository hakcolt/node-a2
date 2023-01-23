import { NextFunction, Request, Response, Router } from "express"
import { PongUseCase } from "../../application/modules/health/useCases/pong"
import { URLConstraint } from "../../application/shared/settings/Constraints"
import { BaseController, IRequest } from "../base/Base.controller"

export class HealthController extends BaseController {
  pong = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest
    const refreshTokenService = new PongUseCase(req.resources)
    this.handleResult(res, next, refreshTokenService.execute())
  }


  override initializeRoutes(router: Router) {
    const ping = URLConstraint.Health.Ping
    router[ping.method](ping.path, this.pong)
  }
}

export default new HealthController()