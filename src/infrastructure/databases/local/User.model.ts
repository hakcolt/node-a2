import { v4 } from "uuid"
import { User } from "../../../domain/user/User"
import db from "./db.mock.json"

type IUser = {
  uid: string,
  token: string | null,
  firstName: string
  lastName: string
  email: string
  gender: string
  password: string
  verified: boolean
  createdAt: string
}

export class UserModel {
  findAndUpdate(uid: string, attributes: Record<string, any>): User | null {
    const userAttrs = ["token", "firstName", "lastName", "email", "gender", "password", "verified"]
    if (!uid || !attributes) return null

    const user = this.get(uid)
    if (!user) return null

    let somethingWasChange = false
    for (const attrName of Object.keys(attributes)) {
      if (userAttrs.includes(attrName)) {
        somethingWasChange = true
        user[attrName] = attributes[attrName]
      }
    }
    if (somethingWasChange) return user
    return null
  }

  get(input: string): IUser | null {
    const user = db.users.find(value => value.email == input || value.uid == input)
    return user ? user : null
  }

  create(user: User): IUser {
    const uid = v4()
    const userModeled: IUser = {
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