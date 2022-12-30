import { User } from "../../../../domain/user/User"
import { IUserRepository } from "../../../../application/modules/users/providerContracts/IUser.repository"
import userModel from "../../../../infrastructure/databases/local/User.model"

export class LocalUserRepository implements IUserRepository {
  async create(userData: User): Promise<User> {
    return userModel.create(userData)
  }
}

