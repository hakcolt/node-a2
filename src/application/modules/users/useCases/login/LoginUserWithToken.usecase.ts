import { ISession } from "../../../../../domain/session/ISession"
import { LocaleType, strings } from "../../../../shared/locals"
import { BaseUseCase } from "../../../../shared/useCases/BaseUseCase"
import { Result, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"
import { IUserRepository } from "../../providerContracts/IUser.repository"

export class LoginUserWithTokenUseCase extends BaseUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider
  ) {
    super()
  }

  override async execute(locale: LocaleType, token: any): Promise<Result> {
    this.setLanguage(locale)
    const result = new ResultData<ISession>()

    if (token && typeof token === "string" && this.authProvider.verifyJWT(token, true)) {
      const sessionInput = this.authProvider.decodeJWT(token)

      const user = await this.repository.fetchBy({ email: sessionInput.email })
      if (user && user.token === token) {
        const refreshSession = this.authProvider.getJWT({ uid: sessionInput.uid, email: sessionInput.email }, false)
        result.setMessage(this.resources.get(strings.USER_ALREADY_LOGGED_IN), 200)
        result.data = refreshSession
      }
    }

    return result
  }

}
