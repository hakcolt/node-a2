import { IUserRepository } from "../../providerContracts/IUser.repository"
import { BaseUseCase, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { UserDTO, UserOutput } from "../../dto/User.dto"
import { Result } from "../../../../shared/useCases/BaseUseCase"
import { Resources, strings } from "../../../../shared/locals"
import { URLConstants } from "../../../../shared/settings/Constants"
import { TokenArgs } from "../../../../../domain/session/TokenArgs"

export class GetUserUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: IUserRepository
  ) {
    super(resources)
  }

  override async execute(userInfo: TokenArgs): Promise<Result> {
    const result = new ResultData<UserOutput>()

    const user = await this.repository.fetchBy({ id: userInfo.id })
    if (!user) {
      result.setError(
        this.resources.get(strings.NEED_AUTHENTICATION),
        403, URLConstants.Users.SignIn.path
      )
      return result
    }

    const userDto = UserDTO.fromUser(user)
    result.setMessage(this.resources.get(strings.SUCCESSFUL_OPERATION), 200)
    result.data = userDto.toResponse()
    return result
  }
}