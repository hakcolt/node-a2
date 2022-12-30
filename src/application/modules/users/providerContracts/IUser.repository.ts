import { User } from "../../../../domain/user/User"

export interface IUserRepository {
  create(user: User): Promise<User>
}