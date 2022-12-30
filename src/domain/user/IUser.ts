import { Gender } from "./Gender.enum"

export interface IUser {
  firstName: string | undefined
  lastName: string | undefined
  email: string
  gender: Gender
  verified: boolean,
  password: string
}