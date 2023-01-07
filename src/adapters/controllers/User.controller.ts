import { BaseController, INextFunction, IRequest, IResponse, IRouter } from "../base/Base.controller"
import { RegisterUserUseCase } from "../../application/modules/users/useCases/register/index"
import { LocalUserRepository } from "../repositories/local/user/User.repository"
import { LoginUserDefaultUseCase } from "../../application/modules/users/useCases/login/LoginUserDefault.usecase.ts"
import { AuthProvider } from "../providers/Auth.provider"
import { LoginUserWithTokenUseCase } from "../../application/modules/users/useCases/login/LoginUserWithToken.usecase"
import { LogoutUserUseCase } from "../../application/modules/users/useCases/logout"

export class UserController extends BaseController {

  logInWithToken = async (req: IRequest, res: IResponse, next: INextFunction) => {
    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const loginService = new LoginUserWithTokenUseCase(repository, authProvider)

    const locale = req.locale
    const token = req.cookies.SESSION_TOKEN

    this.handleMiddleware(res, next, loginService.execute(locale, token))
  } 
  
  logInDefault = async (req: IRequest, res: IResponse, next: INextFunction) => {
    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const loginService = new LoginUserDefaultUseCase(repository, authProvider)

    const locale = req.locale
    const credentials = req.body

    this.handleResult(res, next, loginService.execute(locale, credentials))
  }

  logOut = async (req: IRequest, res: IResponse, next: INextFunction) => {
    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const logoutService = new LogoutUserUseCase(repository, authProvider)

    const locale = req.locale
    const token = req.cookies.SESSION_TOKEN

    this.handleResult(res, next, logoutService.execute(locale, token))
  }

  signUp = async (req: IRequest, res: IResponse, next: INextFunction) => {
    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
    const registerService = new RegisterUserUseCase(repository, authProvider)

    const locale = req.locale
    const user = req.body
    

    this.handleResult(res, next, registerService.execute(locale, user))
  }
  
  override initializeRoutes(router: IRouter) {
    router.post("/users/logout", this.logOut)
    router.post("/users/login", this.logInWithToken, this.logInDefault)
    router.post("/users/signup", this.signUp)
  }
}

export default new UserController()