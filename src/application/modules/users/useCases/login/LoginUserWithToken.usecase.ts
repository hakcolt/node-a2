import { ISession } from "../../../../../domain/session/ISession"
import { IBaseUseCase } from "../../../../shared/useCases/IBaseUseCase"
import { Result, ResultData } from "../../../../shared/useCases/Result"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"
import { IUserRepository } from "../../providerContracts/IUser.repository"

export class LoginUserWithTokenUseCase implements IBaseUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider
  ) { }

  async execute(token: any): Promise<Result> {
    const result = new ResultData<ISession>()

    if (token && typeof token === "string" && this.authProvider.verifyJWT(token, true)) {
      const sessionInput = this.authProvider.decodeJWT(token)

      const user = await this.repository.fetch(sessionInput.email)
      if (user && user.token === token) {
        const refreshSession = this.authProvider.getJWT({ uid: sessionInput.uid, email: sessionInput.email }, false)
        result.setMessage("Login successful", 200)
        result.data = refreshSession
      }
    }

    return result
  }

}
