import { beforeAll, describe, expect, it } from "vitest"
import { RegisterUserUseCase } from "../../../../../../src/application/modules/users/useCases/register"
import { LocalUserRepository } from "../../../../../adapters/repositories/local/user/User.repository"
import { AuthProvider } from "../../../../../adapters/providers/Auth.provider"

describe("when try to register user", () => {
  let registerUseCase: RegisterUserUseCase
  beforeAll(() => {
    const repo = new LocalUserRepository()
    const auth = new AuthProvider()
    registerUseCase = new RegisterUserUseCase(repo, auth)
  })

  it("should return 201 if user was created", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests@gmail.com",
      "gender": "Male",
      "password": "test123",
    })

    expect(result.error).toBe(undefined)
    expect(result.message).toBe("User created, go to /login to get the access token")
    expect(result.statusCode).toBe(201)
    expect(result.isSucess).toBe(true)
  })

  it("should return a 400 error if user email was invalid", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests2@gmailcom",
      "gender": "Male",
      "password": "test123",
    })

    expect(result.message).toBe(undefined)
    expect(result.error).toBe("Invalid email")
    expect(result.statusCode).toBe(400)
    expect(result.isSucess).toBe(false)
  })

  it("should return a 400 error if user password has less than 6 characters", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests2@gmail.com",
      "gender": "Male",
      "password": "test",
    })

    expect(result.message).toBe(undefined)
    expect(result.error).toBe("Invalid password")
    expect(result.statusCode).toBe(400)
    expect(result.isSucess).toBe(false)
  })

  it("should return a 400 error if user gender was invalid", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests2@gmail.com",
      "gender": "test",
      "password": "test123",
    })

    expect(result.message).toBe(undefined)
    expect(result.error).toBe("Invalid gender")
    expect(result.statusCode).toBe(400)
    expect(result.isSucess).toBe(false)
  })

  it("should return a 403 error if user already exists", async () => {
    const createUser = async () => registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests2@gmail.com",
      "gender": "male",
      "password": "test123",
    })

    const result = await createUser()
    expect(result.message).toBe("User created, go to /login to get the access token")
    expect(result.error).toBe(undefined)
    expect(result.statusCode).toBe(201)
    expect(result.isSucess).toBe(true)

    const result2 = await createUser()
    expect(result2.error).toBe("User already exists")
    expect(result2.message).toBe(undefined)
    expect(result2.statusCode).toBe(403)
    expect(result2.isSucess).toBe(false)
  })

  it("should return a 400 error if any attribute was missing", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "email": "tests2@gmail.com"
    })

    expect(result.message).toBe(undefined)
    expect(result.error).toBe("Missing attributes: " + "lastName: string, gender: string, password: string")
    expect(result.statusCode).toBe(400)
    expect(result.isSucess).toBe(false)
  })
})
