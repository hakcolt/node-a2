import { BaseUseCase } from "../../../../shared/useCases/BaseUseCase"
import { Result, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { ISession } from "../../../../../domain/session/ISession"
import { IUserRepository } from "../../providerContracts/IUser.repository"
import { CredentialDTO } from "../../dto/Credential.dto"
import { User } from "../../../../../domain/user/User"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"
import { strings, Resources } from "../../../../shared/locals"

export class LoginUserDefaultUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider) {
    super(resources)
  }

  override async execute(data: any): Promise<Result> {
    const result = new ResultData<ISession>()

    const credentialDTO = CredentialDTO.fromJSON(data)
    if (!credentialDTO.validate(result, this.resources)) return result

    const user = await this.repository.fetchBy({ email: credentialDTO.email })
    if (
      !this.authenticateUser(result, credentialDTO, user) ||
      !await this.createLongSection(result, user!, credentialDTO)
    ) return result

    this.createRefreshSection(result, user!, credentialDTO)
    return result
  }

  authenticateUser(result: Result, credentialDTO: CredentialDTO, user: User | null) {
    if (user && this.authProvider.auth(credentialDTO.password, user.password)) return true

    result.setError(this.resources.get(strings.EMAIL_PASSWORD_INVALID), 403)
    return false
  }

  async createLongSection(result: ResultData<ISession>, user: User, credentialDTO: CredentialDTO): Promise<boolean> {
    const { token } = this.authProvider.getJWT({ uid: user.uid!, email: credentialDTO.email }, true)
    user.token = token
    const isUpdated = await this.repository.update(user)


    if (isUpdated) {
      result.cookie = { name: "SESSION_TOKEN", value: token }
      return true
    } else {
      result.setError(this.resources.get(strings.SOMETHING_WAS_WRONG), 500)
      return false
    }
  }

  createRefreshSection(result: ResultData<ISession>, user: User, credentialDTO: CredentialDTO): void {
    const session = this.authProvider.getJWT({ uid: user.uid!, email: credentialDTO.email }, false)

    result.setMessage(this.resources.get(strings.LOGIN_SUCESSFUL), 200)
    result.data = session
  }
}