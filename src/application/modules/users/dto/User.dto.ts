import { Gender } from "../../../../domain/user/Gender.enum"
import { User } from "../../../../domain/user/User"
import { Result } from "../../../shared/useCases/Result"
import passwordUtil from "../../../shared/utils/PasswordUtil"


type IUserDTO = {
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
    userDto.email = data.email
    userDto.gender = data.gender
    userDto.password = data.password
    return userDto
  }

  validate(result: Result<any>): boolean {
    const attributes = [ "firstName", "lastName", "email", "gender", "password" ]
    const missingAttributes: string[] = []

    for (const attribute in attributes) {
      const userAttribute = this[ attribute ]
      if (!userAttribute || typeof userAttribute === "string") {
        missingAttributes.push(attribute)
      }
    }

    if(!missingAttributes.length) {
      result.setError(new Error("Missing attributes: " + missingAttributes), 400)
      return false
    }

    const genders = [ Gender.MALE, Gender.FEMALE, Gender.OTHER ]
    if (!genders.find(gender => gender === this.gender)) {
      result.setError(new Error("Invalid gender"), 400)
      return false
    }

    const validateEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
    console.log(validateEmail.test(this.email))
    if (!validateEmail.test(this.email)) {
      result.setError(new Error("Invalid email"), 400)
      return false
    }

    return true
  }

  toDomain(): User {
    const user = new User()
    user.uid = null
    user.firstName = this.firstName
    user.lastName = this.lastName
    user.email = this.email
    user.gender = this.gender
    user.password = this.password
    user.verified = false
    user.createdAt = new Date().toISOString()
    return user
  }

  async encryptPassword() {
    this.password = await passwordUtil.encrypt(this.password)
  }
}
