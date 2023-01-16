import { BaseController, IRequest } from "../base/Base.controller"
import { LocalUserRepository } from "../repositories/local/user/User.repository"
import { LoginUserUseCase } from "../../application/modules/auth/useCases/signIn"
import { AuthProvider } from "../providers/Auth.provider"
import { RefreshTokenUseCase } from "../../application/modules/auth/useCases/refresh"
import { NextFunction, Request, Response, Router } from "express"
import { URLConstraint } from "../../application/shared/settings/Constraints"

export class AuthController extends BaseController {

  refresh = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const refreshTokenService = new RefreshTokenUseCase(req.resources, repository, authProvider)

    const token = req.cookies["nodeA2.refreshToken"]

    this.handleResult(res, next, refreshTokenService.execute(token))
  }

  signIn = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const loginService = new LoginUserUseCase(req.resources, repository, authProvider)

    const credentials = req.body

    this.handleResult(res, next, loginService.execute(credentials))
  }

  override initializeRoutes(router: Router) {
    const refreshUrl = URLConstraint.Users.Refresh
    router[refreshUrl.method](refreshUrl.address, this.refresh)
    
    const signInUrl = URLConstraint.Users.SignIn
    router[signInUrl.method](signInUrl.address, this.signIn)
  }
}

export default new AuthController()