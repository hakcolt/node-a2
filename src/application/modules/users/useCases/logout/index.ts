import { IUserRepository } from "../../providerContracts/IUser.repository"
import { BaseUseCase, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { Result } from "../../../../shared/useCases/BaseUseCase"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"
import { LocaleType, Resources, strings } from "../../../../shared/locals"

export class LogoutUserUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider
  ) {
    super(resources)
  }

  override async execute(token: any): Promise<Result> {
    const result = new ResultData()

    if (token && typeof token === "string" && this.authProvider.verifyJWT(token, true)) {
      const sessionInput = this.authProvider.decodeJWT(token)

      const user = await this.repository.fetchBy({ email: sessionInput.email })
      if (user && user.token === token) {
        result.cookie = { name: "SESSION_TOKEN", value: null }
        result.setMessage(this.resources.get(strings.USER_DISCONNECTED), 200)
        return result
      }
    }
    result.setError(this.resources.get(strings.NO_USER_LOGGED_IN), 409)
    return result
  }
}