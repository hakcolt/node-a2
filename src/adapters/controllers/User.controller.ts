import { Request, Response } from "express-serve-static-core"
import { BaseController } from "../base/Base.controller"
import { NextFunction, Router } from "express"
import { RegisterUserUseCase } from "../../application/modules/users/useCases/register/index"
import { LocalUserRepository } from "../repositories/local/user/User.repository"
import { LoginUserDefaultUseCase } from "../../application/modules/users/useCases/login/LoginUserDefault.usecase.ts"
import { AuthProvider } from "../providers/Auth.provider"
import { LoginUserWithTokenUseCase } from "../../application/modules/users/useCases/login/LoginUserWithToken.usecase"

export class UserController extends BaseController {

  logInWithToken = (req: Request, res: Response, next: NextFunction) => {
    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const loginService = new LoginUserWithTokenUseCase(repository, authProvider)
    const token = req.cookies.SESSION_TOKEN

    this.handleMiddleware(res, next, loginService.execute(token))
  } 
  
  logInDefault = async (req: Request, res: Response, next: NextFunction) => {
    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const loginService = new LoginUserDefaultUseCase(repository, authProvider)
    const credentials = req.body

    this.handleResult(res, next, loginService.execute(credentials))
  }

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const registerService = new RegisterUserUseCase(repository, authProvider)
    const user = req.body
    

    this.handleResult(res, next, registerService.execute(user))
  }
  
  initializeRoutes(router: Router) {
    router.post("/users/login", this.logInWithToken, this.logInDefault)
    router.post("/users/signup", this.signUp)
  }
}

export default new UserController()