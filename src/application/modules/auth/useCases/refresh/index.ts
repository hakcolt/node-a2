import { AccessToken } from "../../../../../domain/session/AccessToken"
import { Resources, strings } from "../../../../shared/locals"
import { BaseUseCase } from "../../../../shared/useCases/BaseUseCase"
import { Result, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"
import { IUserRepository } from "../../../users/providerContracts/IUser.repository"
import { UserTokenDTO } from "../../dto/UserToken.dto"

export class RefreshTokenUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider
  ) {
    super(resources)
  }

  override async execute(token: any): Promise<Result> {
    const result = new ResultData<UserTokenDTO>()

    if (token && typeof token === "string" && this.authProvider.verifyJWT(token, true)) {
      const sessionInput = this.authProvider.decodeJWT(token)

      const user = await this.repository.fetchBy({ email: sessionInput.email })
      if (user && user.refreshToken === token) {
        const accessToken = this.authProvider.getJWT({ uid: sessionInput.uid, email: sessionInput.email }, false)
        result.setMessage(this.resources.get(strings.USER_ALREADY_LOGGED_IN), 200)
        const userDto = new UserTokenDTO(accessToken, user)
        result.data = userDto
        return result
      }
    }
    result.setError(this.resources.get(strings.NEED_AUTHENTICATION), 403)

    return result
  }

}
