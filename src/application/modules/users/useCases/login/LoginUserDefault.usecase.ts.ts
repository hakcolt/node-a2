import { IBaseUseCase } from "../../../../shared/useCases/IBaseUseCase"
import { Result, ResultData } from "../../../../shared/useCases/Result"
import { ISession } from "../../../../../domain/session/ISession"
import { IUserRepository } from "../../providerContracts/IUser.repository"
import { CredentialDTO } from "../../dto/Credential.dto"
import { User } from "../../../../../domain/user/User"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"

export class LoginUserDefaultUseCase implements IBaseUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider) { }

  async execute(data: any): Promise<Result> {
    const result = new ResultData<ISession>()

    const credentialDTO = CredentialDTO.fromJSON(data)
    if (!credentialDTO.validate(result)) return result

    const user = await this.repository.fetch(credentialDTO.email)
    if (
      !this.authenticateUser(result, credentialDTO, user) ||
      !await this.createLongSection(result, user!, credentialDTO)
    ) return result

    this.createRefreshSection(result, user!, credentialDTO)
    return result
  }

  authenticateUser(result: Result, credentialDTO: CredentialDTO, user: User | null) {
    if (user && this.authProvider.auth(credentialDTO.password, user.password)) return true

    result.setError("Email or password incorrect", 403)
    return false
  }

  async createLongSection(result: ResultData<ISession>, user: User, credentialDTO: CredentialDTO): Promise<boolean> {
    const { token } = this.authProvider.getJWT({ uid: user.uid!, email: credentialDTO.email}, true)
    const isUpdated = await this.repository.update(user.uid, { token })


    if (isUpdated) {
      result.cookie = { name: "SESSION_TOKEN", value: token }
      return true
    } else {
      result.setError("Could not complete the operation. Try again later", 400)
      return false
    }
  }

  createRefreshSection(result: ResultData<ISession>, user: User, credentialDTO: CredentialDTO): void {
    const session = this.authProvider.getJWT({ uid: user.uid!, email: credentialDTO.email}, false)

    result.setMessage("Login successful", 200)
    result.data = session
  }
}