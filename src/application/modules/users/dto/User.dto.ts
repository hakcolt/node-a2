import { Gender } from "../../../../domain/user/Gender.enum"
import { IUser } from "../../../../domain/user/IUser"
import { User } from "../../../../domain/user/User"
import { plurals, Resources, strings } from "../../../shared/locals"
import { Result } from "../../../shared/useCases/BaseUseCase"
import validation from "../../../shared/utils/Validation"

export class UserDTO {
  firstName: string
  lastName: string
  email: string
  imageUrl: string | null
  gender: Gender | string
  password: string

  static fromJSON(data: any): UserDTO {
    const userDto = new UserDTO()
    userDto.firstName = data.firstName
    userDto.lastName = data.lastName
    userDto.email = data.email?.toLowerCase()
    userDto.imageUrl = data.imageUrl
    userDto.gender = data.gender?.toLowerCase()
    if (data.password) userDto.password = data.password
    return userDto
  }

  validate(result: Result, resources: Resources): boolean {
    const missingAttributes = validation.validateObject(this, ["firstName:string", "lastName:string", "email:string", "gender:string", "password:string"])

    if (missingAttributes.length) {
      result.setError(resources.getWithParams(plurals.MISSING_ATRIBUTES, validation.formatMissingAttributes(missingAttributes)), 400)
      return false
    }

    if (!validation.validatePassword(this.password)) {
      result.setError(resources.get(strings.INVALID_PASSWORD), 400)
      return false
    }

    const genders = Object.values(Gender)
    if (!genders.includes(this.gender as Gender)) {
      result.setError(resources.get(strings.INVALID_GENDER), 400)
      return false
    }

    if (!validation.validateEmail(this.email)) {
      result.setError(resources.get(strings.INVALID_EMAIL), 400)
      return false
    }
    return true
  }

  toDomain(): IUser {
    const user: IUser = new User()
    user.id = null
    user.refreshToken = null
    user.firstName = this.firstName
    user.lastName = this.lastName
    user.email = this.email
    user.imageUrl = this.imageUrl
    user.gender = this.gender
    user.password = this.password
    user.verified = false
    user.createdAt = new Date().toISOString()
    return user
  }
}
