import { User } from "../../../../domain/user/User"
import { IUserRepository } from "../../../../application/modules/users/providerContracts/IUser.repository"
import userModel from "../../../../infrastructure/databases/local/User.model"

export class LocalUserRepository implements IUserRepository {
  async update(uid: string, attributes: Record<string, any>): Promise<User | null> {
    return userModel.findAndUpdate(uid, attributes)
  }
  async fetch(email: string): Promise<User | null> {
    return userModel.get(email)
  }
  async create(userData: User): Promise<User | null> {
    return userModel.create(userData)
  }
}

