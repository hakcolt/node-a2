import { User } from "../../../../domain/user/User"

export interface IUserRepository {
  update(uid: string | null, attribute: Record<string, any>): Promise<User | null>
  fetch(email: string): Promise<User | null>
  create(user: User): Promise<User | null>
}