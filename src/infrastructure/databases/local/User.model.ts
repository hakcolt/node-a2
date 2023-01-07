import { v4 } from "uuid"
import { IUser } from "../../../domain/user/IUser"
import { User } from "../../../domain/user/User"
import db from "./db.mock"

export class UserModel {
  update(user: User): User | null {
    for (const userFetched of db.users)
      if (userFetched.uid === user.uid) return user
    return null
  }

  getBy(input: Record<string, any>): User | null {
    const inputKeys = Object.keys(input)
    for (const user of db.users) {
      for (const keyToVerify of inputKeys) {
        if (user[keyToVerify] === undefined || user[keyToVerify] !== input[keyToVerify]) break
        return user
      }
    }
    return null
  }

  create(user: IUser): User {
    const uid = v4()
    const userModeled: User = {
      uid,
      token: user.token,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      gender: user.gender,
      createdAt: user.createdAt,
      verified: user.verified
    }
    db.users.push(userModeled)
    return userModeled
  }
}

export default new UserModel()