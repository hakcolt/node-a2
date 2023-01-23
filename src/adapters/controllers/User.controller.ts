import { BaseController, IRequest } from "../base/Base.controller"
import { RegisterUserUseCase } from "../../application/modules/users/useCases/signUp"
import { AuthProvider } from "../providers/Auth.provider"
import { NextFunction, Request, Response, Router } from "express"
import { URLConstraint } from "../../application/shared/settings/Constraints"
import { GetUserUseCase } from "../../application/modules/users/useCases/get"
import { RemoteUserRepository } from "../repositories/remote/User.repository"

export class UserController extends BaseController {
  signUp = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new RemoteUserRepository()
    const authProvider = new AuthProvider()
    const registerService = new RegisterUserUseCase(req.resources, repository, authProvider)

    const user = req.body

    this.handleResult(res, next, registerService.execute(user))
  }

  getUser = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new RemoteUserRepository()
    const registerService = new GetUserUseCase(req.resources, repository)

    const tokenArgs = req.userInfo

    this.handleResult(res, next, registerService.execute(tokenArgs))
  }

  override initializeRoutes(router: Router) {
    const signUpUrl = URLConstraint.Users.SignUp
    router[signUpUrl.method](signUpUrl.path, this.signUp)
    
    const getUserUrl = URLConstraint.Users.Get
    router[getUserUrl.method](getUserUrl.path, this.getUser)
  }
}

export default new UserController()