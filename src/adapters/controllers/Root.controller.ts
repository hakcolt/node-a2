import { BaseController, IRequest } from "../base/Base.controller"
import { NextFunction, Request, Response, Router } from "express"
import { URLConstraint } from "../../application/shared/settings/Constraints"
import { RemoteLinkRepository } from "../repositories/remote/Link.repository"
import { RedirectUseCase } from "../../application/modules/root/useCases/redirect"

export class RootController extends BaseController {
  redirect = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new RemoteLinkRepository()
    const redirectLinkService = new RedirectUseCase(req.resources, repository)

    const path = `/${req.params.path}`

    this.handleResult(res, next, redirectLinkService.execute(path))
  }

  override initializeRoutes(router: Router) {
    const redirectLinkUrl = URLConstraint.Root.Redirect
    router[redirectLinkUrl.method](redirectLinkUrl.path, this.redirect)
  }
}

export default new RootController()