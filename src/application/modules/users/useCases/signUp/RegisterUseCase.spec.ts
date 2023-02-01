import { beforeAll, describe, expect, it } from "vitest"
import { RegisterUserUseCase } from "."
import { LocalUserRepository } from "../../../../../adapters/repositories/local/User.repository"
import { AuthProvider } from "../../../../../adapters/providers/Auth.provider"
import { createResource, plurals, strings } from "../../../../shared/locals"
import { URLConstants } from "../../../../shared/settings/Constants"

describe("when try to register user", () => {
  let registerUseCase: RegisterUserUseCase
  let auth: AuthProvider
  beforeAll(() => {
    const repo = new LocalUserRepository()
    auth = new AuthProvider()
    registerUseCase = new RegisterUserUseCase(createResource(), repo, auth)
  })

  it("should return 201 if user was created", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests@gmail.com",
      "gender": "Male",
      "password": "Test123",
    })

    expect(result.error).toBeUndefined()
    expect(result.message).toBe(registerUseCase.resources.get(strings.USER_CREATED))
    expect(result.statusCode).toBe(201)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBe(URLConstants.Users.SignIn.path)
  })

  it("should return a 400 error if user email was invalid", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests2@gmailcom",
      "gender": "Male",
      "password": "Test123",
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(registerUseCase.resources.get(strings.INVALID_EMAIL))
    expect(result.statusCode).toBe(400)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return a 400 error if user password has less than 6 characters", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests2@gmail.com",
      "gender": "Male",
      "password": "Te4t",
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(registerUseCase.resources.get(strings.INVALID_PASSWORD))
    expect(result.statusCode).toBe(400)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if password has only lower case letters", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests2@gmail.com",
      "gender": "Male",
      "password": "testtest",
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(registerUseCase.resources.get(strings.INVALID_PASSWORD))
    expect(result.statusCode).toBe(400)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return a 400 error if user gender was invalid", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests2@gmail.com",
      "gender": "test",
      "password": "Test123",
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(registerUseCase.resources.get(strings.INVALID_GENDER))
    expect(result.statusCode).toBe(400)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return a 403 error if user already exists", async () => {
    const createUser = async () => registerUseCase.execute({
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "tests2@gmail.com",
      "gender": "male",
      "password": "Test123",
    })

    const result = await createUser()
    expect(result.message).toBe(registerUseCase.resources.get(strings.USER_CREATED))
    expect(result.error).toBeUndefined()
    expect(result.statusCode).toBe(201)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBe(URLConstants.Users.SignIn.path)


    const result2 = await createUser()
    expect(result2.error).toBe(registerUseCase.resources.get(strings.USER_ALREADY_EXISTS))
    expect(result2.message).toBeUndefined()
    expect(result2.statusCode).toBe(409)
    expect(result2.isSuccess).toBeFalsy()
    expect(result2.next).toBeUndefined()
  })

  it("should return a 400 error if any attribute was missing", async () => {
    const result = await registerUseCase.execute({
      "firstName": "Igor",
      "email": "tests2@gmail.com"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(registerUseCase.resources.getWithParams(plurals.MISSING_ATRIBUTES, "lastName: string, gender: string, password: string"))
    expect(result.statusCode).toBe(400)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })
})
