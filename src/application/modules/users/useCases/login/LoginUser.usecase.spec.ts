import configs from "../../../../../infrastructure/config"
import { beforeAll, describe, expect, it } from "vitest"
import { AuthProvider } from "../../../../../adapters/providers/Auth.provider"
import { LocalUserRepository } from "../../../../../adapters/repositories/local/user/User.repository"
import { AppSettings } from "../../../../shared/settings/AppSettings"
import { LoginUserDefaultUseCase } from "./LoginUserDefault.usecase.ts"
import { LoginUserWithTokenUseCase } from "./LoginUserWithToken.usecase"
import { ResultData } from "../../../../shared/useCases/Result"

import { ISession } from "../../../../../domain/session/ISession"

AppSettings.init(configs)
AppSettings.JWT_LONG_SESSION_KEY = "1234"
AppSettings.JWT_REFRESH_SESSION_KEY = "4321"

describe("when try to login user with email and password", () => {
  let loginUseCase: LoginUserDefaultUseCase
  
  beforeAll(() => {
    const repo = new LocalUserRepository()
    const auth = new AuthProvider()
    loginUseCase = new LoginUserDefaultUseCase(repo, auth)
  })

  it("should return status 200 if there is not any problem", async () => {
    const result = await loginUseCase.execute({
      email: "test@hakcolt.com",
      password: "123456"
    })

    expect(result).toBeInstanceOf(ResultData)
    expect(result as ResultData<ISession>).toHaveProperty(["data", "token"])
    expect(result as ResultData<ISession>).toHaveProperty(["cookie", "value"])
    expect(result.error).toBe(undefined)
    expect(result.message).toBe("Login successful")
    expect(result.statusCode).toBe(200)
    expect(result.isSucess).toBe(true)
  })

  it("should return status 400 if email is missing", async () => {
    const result = await loginUseCase.execute({
      email: 10,
      password: "123456"
    })

    expect(result.message).toBe(undefined)
    expect(result.error).toBe("Missing attributes: " + "email: string")
    expect(result.statusCode).toBe(400)
    expect(result.isSucess).toBe(false)
  })

  it("should return status 403 if email is invalid", async () => {
    const result = await loginUseCase.execute({
      email: "test@hakcoltcom",
      password: "123456"
    })

    expect(result.message).toBe(undefined)
    expect(result.error).toBe("Email or password incorrect")
    expect(result.statusCode).toBe(403)
    expect(result.isSucess).toBe(false)
  })

  it("should return status 403 if password length is less than 6", async () => {
    const result = await loginUseCase.execute({
      email: "test@hakcolt.com",
      password: "1234"
    })

    expect(result.message).toBe(undefined)
    expect(result.error).toBe("Email or password incorrect")
    expect(result.statusCode).toBe(403)
    expect(result.isSucess).toBe(false)
  })
})

describe("when try to login user with token", () => {
  let loginUseCase: LoginUserWithTokenUseCase
  
  beforeAll(() => {
    const repo = new LocalUserRepository()
    const auth = new AuthProvider()
    loginUseCase = new LoginUserWithTokenUseCase(repo, auth)
  })

  it("should return status 200 if there is not any problem", async () => {
    const result = await loginUseCase.execute("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MTc3YTk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjcyOTY1MjQ4LCJleHAiOjE2NzI5NjU4NTJ9.WCjC6djVXOYF8434V11UJxR0SMlcLJmch1lMv9CRrM4")

    expect(result.error).toBe(undefined)
    expect(result.message).toBe("Login successful")
    expect(result.statusCode).toBe(200)
    expect(result.isSucess).toBe(true)
  })

  it("should return nothing if input is wrong", async () => {
    const result = await loginUseCase.execute("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MTc3Yk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjcyY0MjA2LCJleHAiOjE2NzI5NjQ4MTB9.S_fS_UtZn1-0kMiQPSPATzatSYme0DkLCHVP9R8P0")

    expect(result.error).toBe(undefined)
    expect(result.message).toBe(undefined)
    expect(result.statusCode).toBe(undefined)
    expect(result.isSucess).toBe(undefined)
  })

  it("should return nothing if token is expires or changed", async () => {
    const result = await loginUseCase.execute("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MTc3YTk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjcyOTY1MTI1LCJleHAiOjE2NzI5NjU3Mjl9.d9SayalbNOmXi8VcABf8_equJZVsi5TfDG8phLJ6eKc")

    expect(result.error).toBe(undefined)
    expect(result.message).toBe(undefined)
    expect(result.statusCode).toBe(undefined)
    expect(result.isSucess).toBe(undefined)
  })

  it("should return nothing if token is null", async () => {
    const result = await loginUseCase.execute(null)

    expect(result.error).toBe(undefined)
    expect(result.message).toBe(undefined)
    expect(result.statusCode).toBe(undefined)
    expect(result.isSucess).toBe(undefined)
  })
})