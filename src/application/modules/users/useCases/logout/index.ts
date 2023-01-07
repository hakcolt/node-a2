import { IUserRepository } from "../../providerContracts/IUser.repository"
import { BaseUseCase, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { Result } from "../../../../shared/useCases/BaseUseCase"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"
import { LocaleType, strings } from "../../../../shared/locals"

export class LogoutUserUseCase extends BaseUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider
  ) {
    super()
  }

  override async execute(locale: LocaleType, token: any): Promise<Result> {
    this.setLanguage(locale)
    const result = new ResultData()

    if (token && typeof token === "string" && this.authProvider.verifyJWT(token, true)) {
      const sessionInput = this.authProvider.decodeJWT(token)

      const user = await this.repository.fetchBy({ email: sessionInput.email })
      if (user && user.token === token) {
        user.token = null
        const userUpdated = await this.repository.update(user)
        result.cookie = { name: "SESSION_TOKEN", value: null }
        if (userUpdated) result.setMessage(this.resources.get(strings.USER_DISCONNECTED), 200)
        else result.setError(this.resources.get(strings.SOMETHING_WAS_WRONG), 500)
        return result
      }
    }
    result.setError(this.resources.get(strings.NO_USER_LOGGED_IN), 409)
    return result
  }
}