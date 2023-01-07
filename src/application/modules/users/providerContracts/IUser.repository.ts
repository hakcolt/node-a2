import { IUser } from "../../../../domain/user/IUser"
import { User } from "../../../../domain/user/User"

export interface IUserRepository {
  update(user: User): Promise<User | null>
  fetchBy(email: Record<string, any>): Promise<User | null>
  create(user: IUser): Promise<User | null>
}