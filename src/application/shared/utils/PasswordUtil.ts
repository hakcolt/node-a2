import bcrypt from "bcrypt"

export class PasswordUtil {
  async encrypt(data: string): Promise<string> {
    return bcrypt.hash(data, 10)
  }
}

export default new PasswordUtil()