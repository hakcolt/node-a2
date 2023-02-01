import configs from "../../../../../infrastructure/config"
import { beforeAll, describe, expect, it } from "vitest"
import { AuthProvider } from "../../../../../adapters/providers/Auth.provider"
import { LocalUserRepository } from "../../../../../adapters/repositories/local/User.repository"
import { AppSettings } from "../../../../shared/settings/AppSettings"
import { URLConstants } from "../../../../shared/settings/Constants"
import { ResultData } from "../../../../shared/useCases/BaseUseCase"

import { LoginUserUseCase } from "."
import { UserTokenDTO } from "../../dto/UserToken.dto"

import { createResource, plurals, strings } from "../../../../shared/locals"

AppSettings.init(configs)

describe("when try to login user with email and password", () => {
  let loginUseCase: LoginUserUseCase
  let auth: AuthProvider

  beforeAll(() => {
    const repo = new LocalUserRepository()
    auth = new AuthProvider()
    loginUseCase = new LoginUserUseCase(createResource(), repo, auth)
  })

  it("should return status 200 if there is not any problem", async () => {
    const result = await loginUseCase.execute({
      email: "test@gmail.com",
      password: "Test123"
    })

    expect(result.error).toBeUndefined()
    expect(result.message).toBe(loginUseCase.resources.get(strings.LOGIN_SUCESSFUL))
    expect(result.statusCode).toBe(200)
    expect(result.isSuccess).toBeTruthy()
    expect(result).toBeInstanceOf(ResultData)
    expect(result as ResultData<UserTokenDTO>).toHaveProperty(["data", "accessToken", "token"])
    expect(result as ResultData<UserTokenDTO>).toHaveProperty(["data", "user", "id"])
    expect(result as ResultData<UserTokenDTO>).toHaveProperty(["cookie", "value"])
    expect(result.next).toBe(URLConstants.Users.Refresh.path)
  })

  it("should return status 400 if email is missing", async () => {
    const result = await loginUseCase.execute({
      email: 0,
      password: "Test123"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.getWithParams(plurals.MISSING_ATRIBUTES, "email: string"))
    expect(result.statusCode).toBe(400)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if email is invalid", async () => {
    const result = await loginUseCase.execute({
      email: "test@hakcoltcom",
      password: "Test123"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.EMAIL_PASSWORD_INVALID))
    expect(result.statusCode).toBe(403)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if password is incorrect", async () => {
    const result = await loginUseCase.execute({
      email: "test@gmail.com",
      password: "Test321"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.EMAIL_PASSWORD_INVALID))
    expect(result.statusCode).toBe(403)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if password length is less than 6", async () => {
    const result = await loginUseCase.execute({
      email: "test@gmail.com",
      password: "1234"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.EMAIL_PASSWORD_INVALID))
    expect(result.statusCode).toBe(403)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if password has only lower case letters", async () => {
    const result = await loginUseCase.execute({
      email: "test@gmail.com",
      password: "testtest"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.EMAIL_PASSWORD_INVALID))
    expect(result.statusCode).toBe(403)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })
})
