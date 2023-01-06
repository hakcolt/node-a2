import { Gender } from "../../../../domain/user/Gender.enum"
import { User } from "../../../../domain/user/User"
import { Result } from "../../../shared/useCases/Result"
import validation from "../../../shared/utils/Validation"


export type IUserDTO = {
  firstName: string,
  lastName: string,
  email: string,
  gender: string,
  password: string
}

export class UserDTO {
  firstName: string
  lastName: string
  email: string
  gender: Gender | string
  password: string

  static fromJSON(data: IUserDTO): UserDTO {
    const userDto = new UserDTO()
    userDto.firstName = data.firstName
    userDto.lastName = data.lastName
    userDto.email = data.email?.toLowerCase()
    userDto.gender = data.gender?.toLowerCase()
    userDto.password = data.password
    return userDto
  }

  validate(result: Result): boolean {
    const missingAttributes = validation.validateObject(this, ["firstName:string", "lastName:string", "email:string", "gender:string", "password:string"])

    if (missingAttributes) {
      result.setError("Missing attributes: " + missingAttributes, 400)
      return false
    }

    if (this.password.length < 6) {
      result.setError("Invalid password", 400)
      return false
    }

    const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER]
    if (!genders.find(gender => gender == this.gender)) {
      result.setError("Invalid gender", 400)
      return false
    }

    const validateEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
    if (!validateEmail.test(this.email)) {
      result.setError("Invalid email", 400)
      return false
    }
    return true
  }

  toDomain(): User {
    const user = new User()
    user.uid = null
    user.token = null
    user.firstName = this.firstName
    user.lastName = this.lastName
    user.email = this.email
    user.gender = this.gender
    user.password = this.password
    user.verified = false
    user.createdAt = new Date().toISOString()
    return user
  }


}
