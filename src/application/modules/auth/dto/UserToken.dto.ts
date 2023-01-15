import { AccessToken } from "../../../../domain/session/AccessToken"
import { User } from "../../../../domain/user/User"
import { UserDTO } from "../../users/dto/User.dto"

class UserOutputDTO {
  id: string
  refreshToken: string | null
  firstName: string
  lastName: string
  email: string
  imageUrl: string | null
  gender: string
  createdAt: string
}

export class UserTokenDTO {
  user: UserOutputDTO
  constructor(
    readonly accessToken: AccessToken,
    user: User
  ) {
    const userDTO = new UserOutputDTO()
    userDTO.id = user.id
    userDTO.refreshToken = user.refreshToken
    userDTO.firstName = user.firstName
    userDTO.lastName = user.lastName
    userDTO.email = user.email
    userDTO.imageUrl = user.imageUrl
    userDTO.gender = user.gender
    userDTO.createdAt = user.createdAt
    this.user = userDTO
  }
  setUser(data: User) {
    
  }
}
