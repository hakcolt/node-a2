import { User } from "../../../../domain/user/User"
import { IUserRepository } from "../../../../application/modules/users/providerContracts/IUser.repository"
import userModel from "../../../../infrastructure/databases/local/User.model"
import { IUser } from "../../../../domain/user/IUser"

export class LocalUserRepository implements IUserRepository {
  async update(user: User): Promise<User | null> {
    return userModel.update(user)
  }
  async fetchBy(attributes: Record<string, any>): Promise<User | null> {
    return userModel.getBy(attributes)
  }
  async create(userData: IUser): Promise<User | null> {
    return userModel.create(userData)
  }
}

