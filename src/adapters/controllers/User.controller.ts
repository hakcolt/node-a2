import { Request, Response } from "express-serve-static-core"
import { BaseController } from "../base/Base.controller"
import { Router } from "express"
import { RegisterUseCase } from "../../application/modules/users/useCases/register/index"
import { LocalUserRepository } from "../repositories/local/user/User.repository"

export class UserController extends BaseController {

  signUp = async (req: Request, res: Response) => {
    const repository = new LocalUserRepository()
    const registerService = new RegisterUseCase(repository)
    
    const result = await registerService.execute(req.body)

    this.handleResult(res, result)
  }
  
  override initializeRoutes(router: Router) {
    router.post("/users/signup", this.signUp)
  }
}

export default new UserController()