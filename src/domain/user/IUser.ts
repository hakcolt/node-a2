import { Link } from "../link/Link"
import { Gender } from "./Gender.enum"

export interface IUser {
  id: string | null
  refreshToken: string | null
  firstName: string
  lastName: string
  email: string
  imageUrl: string | null
  gender: string
  password: string
  verified: boolean
  createdAt: string
}