import { v4 } from "uuid"
import { IUser } from "../../../domain/user/IUser"
import { User } from "../../../domain/user/User"
import db from "./db.mock"

export class UserModel {
  update(userToPush: User): User | null {
    for (const index in db.users) {
      const userInDb = db.users[index]
      if (userInDb.id !== userToPush.id) continue
      db.users[index] = userToPush
      return userToPush
    }
    return null
  }

  getBy(input: Record<string, any>): User | null {
    const inputKeys = Object.keys(input)
    const userKeys = Object.keys(db.users[0])
    for (const user of db.users) {
      for (const keyToVerify of inputKeys) {
        if (!userKeys.includes(keyToVerify) || user[keyToVerify] !== input[keyToVerify]) break
        return user
      }
    }
    return null
  }

  create(user: IUser): User {
    const uid = v4()
    const userModeled: User = {
      id: uid,
      refreshToken: user.refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      imageUrl: user.imageUrl,
      gender: user.gender,
      createdAt: user.createdAt,
      verified: user.verified,
    }
    db.users.push(userModeled)
    return userModeled
  }
}

export default new UserModel()