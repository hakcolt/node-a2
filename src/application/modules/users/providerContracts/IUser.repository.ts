import { IUser } from "../../../../domain/user/IUser"
import { User } from "../../../../domain/user/User"

export interface IUserRepository {
  update(where: Record<string, any>, attributes: Record<string, any>): Promise<User | null>
  fetchBy(email: Record<string, any>): Promise<User | null>
  create(user: IUser): Promise<User | null>
}