import { User } from "../../../../../domain/user/User"
import { ISession } from "../../../../../domain/session/ISession"
import sessionUtil from "../../../../shared/utils/SessionUtil"
import { IUserRepository } from "../../providerContracts/IUser.repository"
import { IBaseUseCase } from "../../../../shared/useCases/IBaseUseCase"
import { UserDTO } from "../../dto/User.dto"
import { Result } from "../../../../shared/useCases/Result"

export class RegisterUseCase implements IBaseUseCase<Result<ISession>> {
  constructor(readonly repository: IUserRepository) { }

  async execute(data: any): Promise<Result<ISession>> {
    const result = new Result<ISession>()
    const userDTO: UserDTO = UserDTO.fromJSON(data)

    if (!userDTO.validate(result)) return result

    const userData = userDTO.toDomain()
    await this.createUser(result, userData)

    return result
  }

  async createUser(result: Result<ISession>, data: User) {
    const user = await this.repository.create(data)

    if (user) {
      result.setMessage("User created", 201)
      result.data = this.createSession(user)
    }
    else result.setError(new Error("User Already exists"), 409)
  }

  createSession(user: User): ISession {
    return sessionUtil.createSession({
      email: user.email,
      emailVerified: user.verified,
      name: user.firstName
    })
  }
}