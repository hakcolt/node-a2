export class User {
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
}