import { BaseUseCase } from "../../../../shared/useCases/BaseUseCase"
import { Result, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { IUserRepository } from "../../../users/providerContracts/IUser.repository"
import { CredentialDTO } from "../../dto/Credential.dto"
import { User } from "../../../../../domain/user/User"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"
import { strings, Resources } from "../../../../shared/locals"
import { UserTokenDTO } from "../../dto/UserToken.dto"
import { URLConstraint } from "../../../../shared/settings/Constraints"

export class LoginUserUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider) {
    super(resources)
  }

  override async execute(data: any): Promise<Result> {
    const result = new ResultData<UserTokenDTO>()

    const credentialDTO = CredentialDTO.fromJSON(data)
    if (!credentialDTO.validate(result, this.resources)) return result

    const user = await this.repository.fetchBy({ email: credentialDTO.email })
    if (
      !this.authenticateUser(result, credentialDTO, user) ||
      !await this.createRefreshToken(result, user!, credentialDTO)
    ) return result

    this.createAccessToken(result, user!, credentialDTO)
    return result
  }

  authenticateUser(result: Result, credentialDTO: CredentialDTO, user: User | null) {
    if (user && this.authProvider.auth(credentialDTO.password, user.password)) return true

    result.setError(this.resources.get(strings.EMAIL_PASSWORD_INVALID), 403)
    return false
  }

  async createRefreshToken(result: ResultData<UserTokenDTO>, user: User, credentialDTO: CredentialDTO): Promise<boolean> {
    const { token, expiresAt } = this.authProvider.getJWT({ id: user.id!, email: credentialDTO.email }, true)
    user.refreshToken = token
    const isUpdated = await this.repository.update(user)


    if (isUpdated) {
      result.cookie = { name: "nodeA2.refreshToken", value: token, expires: new Date(expiresAt) }
      return true
    } else {
      result.setError(this.resources.get(strings.SOMETHING_WAS_WRONG), 500)
      return false
    }
  }

  createAccessToken(result: ResultData<UserTokenDTO>, user: User, credentialDTO: CredentialDTO): void {
    const accessToken = this.authProvider.getJWT({ id: user.id!, email: credentialDTO.email }, false)

    result.setMessage(this.resources.get(strings.LOGIN_SUCESSFUL), 200, URLConstraint.Users.Refresh.address)
    const userDto = new UserTokenDTO(accessToken, user)
    result.data = userDto
  }
}