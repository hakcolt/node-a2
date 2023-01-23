import { Link } from "../link/Link"
import { IUser } from "./IUser"

export class User implements IUser {
  id: string
  refreshToken: string | null
  firstName: string
  lastName: string
  email: string
  imageUrl: string | null
  gender: string
  password: string
  verified: boolean
  createdAt: string
  links: Link[] | null
}