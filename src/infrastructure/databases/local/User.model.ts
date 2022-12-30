import { v4 } from "uuid"
import { User } from "../../../domain/user/User"
import db from "./db.mock.json"

export class UserModel {
  async create(user: User): Promise<User> {
    const uid = v4()
    user.uid = uid
    db.users.push({
      uid,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      gender: user.gender,
      createdAt: user.createdAt,
      verified: user.verified
    })
    return user
  }
}

export default new UserModel()