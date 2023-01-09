import { ISession } from "../../../../../domain/session/ISession"
import { LocaleType, Resources, strings } from "../../../../shared/locals"
import { BaseUseCase } from "../../../../shared/useCases/BaseUseCase"
import { Result, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"
import { IUserRepository } from "../../providerContracts/IUser.repository"

export class LoginUserWithTokenUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider
  ) {
    super(resources)
  }

  override async execute(token: any): Promise<Result> {
    const result = new ResultData<ISession>()

    if (token && typeof token === "string" && this.authProvider.verifyJWT(token, true)) {
      const sessionInput = this.authProvider.decodeJWT(token)

      const user = await this.repository.fetchBy({ email: sessionInput.email })
      if (user && user.token === token) {
        const refreshSession = this.authProvider.getJWT({ uid: sessionInput.uid, email: sessionInput.email }, false)
        result.setMessage(this.resources.get(strings.USER_ALREADY_LOGGED_IN), 200)
        result.data = refreshSession
        return result
      }
    }
    result.setError(this.resources.get(strings.NEED_AUTHENTICATION), 403)

    return result
  }

}
