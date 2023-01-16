import { AccessToken } from "../../../../domain/session/AccessToken"
import { User } from "../../../../domain/user/User"
import { UserDTO, UserOutput } from "../../users/dto/User.dto"

export class UserTokenDTO {
  user: UserOutput
  constructor(
    readonly accessToken: AccessToken,
    user: User
  ) {
    const userDTO = UserDTO.fromUser(user)
    this.user = userDTO.toResponse()
  }
}
