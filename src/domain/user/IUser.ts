import { Gender } from "./Gender.enum"

export interface IUser {
  uid: string | null
  token: string | null
  firstName: string
  lastName: string
  email: string
  gender: string
  password: string
  verified: boolean
  createdAt: string
}