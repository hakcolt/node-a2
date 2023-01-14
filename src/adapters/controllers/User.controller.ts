import { BaseController, IRequest } from "../base/Base.controller"
import { RegisterUserUseCase } from "../../application/modules/users/useCases/register/index"
import { LocalUserRepository } from "../repositories/local/user/User.repository"
import { LoginUserDefaultUseCase } from "../../application/modules/users/useCases/login/LoginUserDefault.usecase.ts"
import { AuthProvider } from "../providers/Auth.provider"
import { LoginUserWithTokenUseCase } from "../../application/modules/users/useCases/login/LoginUserWithToken.usecase"
import { LogoutUserUseCase } from "../../application/modules/users/useCases/logout"
import { NextFunction, Request, Response, Router } from "express"

export class UserController extends BaseController {

  logInWithToken = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const loginService = new LoginUserWithTokenUseCase(req.resources, repository, authProvider)

    const token = req.cookies.SESSION_TOKEN

    this.handleResult(res, next, loginService.execute(token))
  }

  logInDefault = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const loginService = new LoginUserDefaultUseCase(req.resources, repository, authProvider)

    const credentials = req.body

    this.handleResult(res, next, loginService.execute(credentials))
  }

  logOut = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const logoutService = new LogoutUserUseCase(req.resources, repository, authProvider)

    const token = req.cookies.SESSION_TOKEN

    this.handleResult(res, next, logoutService.execute(token))
  }

  signUp = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const registerService = new RegisterUserUseCase(req.resources, repository, authProvider)

    const user = req.body

    this.handleResult(res, next, registerService.execute(user))
  }

  override initializeRoutes(router: Router) {
    router.get("v1/users/logout", this.logOut)
    router.get("v1/users/login", this.logInWithToken)
    router.post("v1/users/login", this.logInDefault)
    router.post("v1/users/signup", this.signUp)
  }
}

export default new UserController()