import { PrismaClient } from "@prisma/client"
import { IUserRepository } from "../../../application/modules/users/providerContracts/IUser.repository"
import { AppSettings } from "../../../application/shared/settings/AppSettings"
import { IUser } from "../../../domain/user/IUser"
import { User } from "../../../domain/user/User"

const prisma = new PrismaClient()

export class RemoteUserRepository implements IUserRepository {
  async update(where: Record<string, any>, attributes: Record<string, any>): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where,
        data: attributes
      })
      return (user as unknown) as User
    } catch (e) {
      if (AppSettings.SERVER_MODE === "development") console.log(e)
      return null
    }
  }

  async fetchBy(attributes: Record<string, any>): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: attributes
      })
      return (user as unknown) as User
    } catch (e) {
      if (AppSettings.SERVER_MODE === "development") console.log(e)
      return null
    }
  }

  async create(userData: IUser): Promise<User | null> {
    try {
      const user = await prisma.user.create({
        data: {
          refreshToken: userData.refreshToken,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          gender: userData.gender,
          imageUrl: userData.imageUrl,
          password: userData.password,
          verified: false,
          createdAt: userData.createdAt
        }
      })
      return (user as unknown) as User
    } catch (e) {
      if (AppSettings.SERVER_MODE === "development") console.log(e)
      return null
    }
  }
}

