import { beforeAll, describe, expect, it } from "vitest"
import { RegisterUseCase } from "../../../../../../src/application/modules/users/useCases/register"
import { LocalUserRepository } from "../../../../../adapters/repositories/local/user/User.repository"

describe("when try to register user", () => {
  let registerUseCase: RegisterUseCase
  beforeAll(() => {
    const repo = new LocalUserRepository()
    registerUseCase = new RegisterUseCase(repo)
  })

  it("should return a 400 error if user was missing or wrong", async () => {
    const userDto = { gender: "bus" }
    const registerService = async (dto) => await registerUseCase.execute(dto)

    expect((await registerService(userDto)).statusCode).toBe(400)

    const error1 = (await registerService(userDto)).error as Error
    expect(error1.message).toBe("Invalid gender")

    const error2 = (await registerService({})).error as Error
    expect(error2.message).toBe("Invalid gender")
  })

  it("should return a 400 error if user email was inavlid", async () => {
    const result = await registerUseCase.execute({
      firstName: "Igor",
      lastName: "Hakcolt",
      email: "test",
      password: 8731,
      gender: "male"
    })
    const error = result.error as Error
    expect(error.message).toBe("Invalid email")
  })
})
