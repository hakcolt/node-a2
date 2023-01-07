import configs from "../../../../../infrastructure/config"
import { beforeAll, describe, expect, it } from "vitest"
import { AuthProvider } from "../../../../../adapters/providers/Auth.provider"
import { LocalUserRepository } from "../../../../../adapters/repositories/local/user/User.repository"
import { AppSettings } from "../../../../shared/settings/AppSettings"
import { LoginUserDefaultUseCase } from "./LoginUserDefault.usecase.ts"
import { LoginUserWithTokenUseCase } from "./LoginUserWithToken.usecase"
import { ResultData } from "../../../../shared/useCases/BaseUseCase"

import { ISession } from "../../../../../domain/session/ISession"
import { LocaleType, plurals, strings } from "../../../../shared/locals"
import dbMock from "../../../../../infrastructure/databases/local/db.mock"

AppSettings.init(configs)
AppSettings.JWT_LONG_SESSION_KEY = "1234"
AppSettings.JWT_REFRESH_SESSION_KEY = "4321"

describe("when try to login user with email and password", () => {
  let loginUseCase: LoginUserDefaultUseCase
  let auth: AuthProvider

  beforeAll(() => {
    const repo = new LocalUserRepository()
    auth = new AuthProvider()
    loginUseCase = new LoginUserDefaultUseCase(repo, auth)
  })

  it("should return status 200 if there is not any problem", async () => {
    const result = await loginUseCase.execute(LocaleType.EN, {
      email: "test@gmail.com",
      password: "Test123"
    })

    expect(result.error).toBeUndefined()
    expect(result.message).toBe(loginUseCase.resources.get(strings.LOGIN_SUCESSFUL))
    expect(result.statusCode).toBe(200)
    expect(result.isSucess).toBeTruthy()
    expect(result).toBeInstanceOf(ResultData)
    expect(result as ResultData<ISession>).toHaveProperty(["data", "token"])
    expect(result as ResultData<ISession>).toHaveProperty(["cookie", "value"])
  })

  it("should return status 400 if email is missing", async () => {
    const result = await loginUseCase.execute(LocaleType.EN, {
      email: 0,
      password: "Test123"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.getWithParams(plurals.MISSING_ATRIBUTES, "email: string"))
    expect(result.statusCode).toBe(400)
    expect(result.isSucess).toBeFalsy()
  })

  it("should return status 403 if email is invalid", async () => {
    const result = await loginUseCase.execute(LocaleType.EN, {
      email: "test@hakcoltcom",
      password: "Test123"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.EMAIL_PASSWORD_INVALID))
    expect(result.statusCode).toBe(403)
    expect(result.isSucess).toBeFalsy()
  })

  it("should return status 403 if password is incorrect", async () => {
    const result = await loginUseCase.execute(LocaleType.EN, {
      email: "test@gmail.com",
      password: "Test321"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.EMAIL_PASSWORD_INVALID))
    expect(result.statusCode).toBe(403)
    expect(result.isSucess).toBeFalsy()
  })

  it("should return status 403 if password length is less than 6", async () => {
    const result = await loginUseCase.execute(LocaleType.EN, {
      email: "test@gmail.com",
      password: "1234"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.EMAIL_PASSWORD_INVALID))
    expect(result.statusCode).toBe(403)
    expect(result.isSucess).toBeFalsy()
  })

  it("should return status 403 if password has only lower case letters", async () => {
    const result = await loginUseCase.execute(LocaleType.EN, {
      email: "test@gmail.com",
      password: "testtest"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.EMAIL_PASSWORD_INVALID))
    expect(result.statusCode).toBe(403)
    expect(result.isSucess).toBeFalsy()
  })
})

describe("when try to login user with token", () => {
  let loginUseCase: LoginUserWithTokenUseCase
  let auth: AuthProvider
  
  beforeAll(() => {
    const repo = new LocalUserRepository()
    auth = new AuthProvider()
    loginUseCase = new LoginUserWithTokenUseCase(repo, auth)
  })

  it("should return status 200 if there is not any problem", async () => {
    const session = auth.getJWT({
      email: "test@hakcolt.com",
      uid: "9177a65d-6f83-478d-954d-10be5a2df24d"
    }, true)
    dbMock.users[1].token = session.token
    const result = await loginUseCase.execute(LocaleType.EN, session.token)

    expect(result.error).toBeUndefined()
    expect(result.message).toBe(loginUseCase.resources.get(strings.USER_ALREADY_LOGGED_IN))
    expect(result.statusCode).toBe(200)
    expect(result.isSucess).toBeTruthy()
  })

  it("should return nothing if input is wrong", async () => {
    const result = await loginUseCase.execute(LocaleType.EN, "eyJhbGciOiJIUzINiIsInR5cCI6IkpXVCJ9.eyJ1aQiOiI5MTc3Yk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjcyY0MjA2LCJleHAiOjE2NzI5NjQ4MT9.S_S_UtZn1-0kMiQPSPATzatSYmeDkLCHVP9R8P0")

    expect(result.error).toBeUndefined()
    expect(result.message).toBeUndefined()
    expect(result.statusCode).toBeUndefined()
    expect(result.isSucess).toBeUndefined()
  })

  it("should return nothing if token is valid but it expires or changed", async () => {
    const repositoryTemp = new LocalUserRepository()
    const authProviderTemp = new AuthProvider()

    authProviderTemp.verifyJWT = () => true
  
    const loginUserCaseTemp = new LoginUserWithTokenUseCase(repositoryTemp, authProviderTemp)
    const result = await loginUserCaseTemp.execute(LocaleType.EN, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MTc3YTk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjcyOTY1MTI1LCJleHAiOjE2NzI5NjU3Mjl9.d9SayalbNOmXi8VcABf8_equJZVsi5TfDG8phLJ6eKc")

    expect(result.error).toBeUndefined()
    expect(result.message).toBeUndefined()
    expect(result.statusCode).toBeUndefined()
    expect(result.isSucess).toBeUndefined()
  })

  it("should return nothing if token is null", async () => {
    const result = await loginUseCase.execute(LocaleType.EN, null)

    expect(result.error).toBeUndefined()
    expect(result.message).toBeUndefined()
    expect(result.statusCode).toBeUndefined()
    expect(result.isSucess).toBeUndefined()
  })
})
