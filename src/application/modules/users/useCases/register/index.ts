import { User } from "../../../../../domain/user/User"
import { IUserRepository } from "../../providerContracts/IUser.repository"
import { IBaseUseCase } from "../../../../shared/useCases/IBaseUseCase"
import { IUserDTO, UserDTO } from "../../dto/User.dto"
import { Result } from "../../../../shared/useCases/Result"
import { IAuthProvider } from "../../providerContracts/IAuth.provider"

export class RegisterUserUseCase implements IBaseUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider
  ) { }

  async execute(data: any): Promise<Result> {
    const result = new Result()
    const userDTO: UserDTO = UserDTO.fromJSON(data as IUserDTO)

    if (!userDTO.validate(result)) return result

    const hasUser = await this.repository.fetch(userDTO.email)

    if (hasUser) {
      result.setError("User already exists", 403)
      return result
    }
    const userData = userDTO.toDomain()
    userData.password = this.authProvider.encryptPassword(userData.password)

    await this.createUser(result, userData)

    return result
  }

  async createUser(result: Result, data: User) {
    const user = await this.repository.create(data)

    if (user) {
      result.setMessage("User created, go to /login to get the access token", 201)
    } else result.setError("User Already exists", 409)
  }
}