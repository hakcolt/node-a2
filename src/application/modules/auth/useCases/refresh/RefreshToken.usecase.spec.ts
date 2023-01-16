import { beforeAll, describe, expect, it } from "vitest"
import { RefreshTokenUseCase } from "."
import { AuthProvider } from "../../../../../adapters/providers/Auth.provider"
import { LocalUserRepository } from "../../../../../adapters/repositories/local/user/User.repository"
import config from "../../../../../infrastructure/config"
import dbMock from "../../../../../infrastructure/databases/local/db.mock"
import { createResource, strings } from "../../../../shared/locals"
import { AppSettings } from "../../../../shared/settings/AppSettings"

AppSettings.init(config)

describe("when try refresh access token", () => {
  let loginUseCase: RefreshTokenUseCase
  let auth: AuthProvider
  
  beforeAll(() => {
    const repo = new LocalUserRepository()
    auth = new AuthProvider()
    loginUseCase = new RefreshTokenUseCase(createResource(), repo, auth)
  })

  it("should return status 200 if there is not any problem", async () => {
    const session = auth.getJWT({
      email: "test@hakcolt.com",
      id: "9177a65d-6f83-478d-954d-10be5a2df24d"
    }, true)
    dbMock.users[1].refreshToken = session.token
    const result = await loginUseCase.execute(session.token)
    
    expect(result.error).toBeUndefined()
    expect(result.message).toBe(loginUseCase.resources.get(strings.USER_ALREADY_LOGGED_IN))
    expect(result.statusCode).toBe(200)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if input is wrong", async () => {
    const result = await loginUseCase.execute("eyJhbGciOiJIUzINiIsInR5cCI6IkpXVCJ9.eyJ1aQiOiI5MTc3Yk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjcyY0MjA2LCJleHAiOjE2NzI5NjQ4MT9.S_S_UtZn1-0kMiQPSPATzatSYmeDkLCHVP9R8P0")

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.NEED_AUTHENTICATION))
    expect(result.statusCode).toBe(403)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if token is valid but it expires or changed", async () => {
    const repositoryTemp = new LocalUserRepository()
    const authProviderTemp = new AuthProvider()

    authProviderTemp.verifyJWT = () => true
  
    const loginUserCaseTemp = new RefreshTokenUseCase(createResource(), repositoryTemp, authProviderTemp)
    const result = await loginUserCaseTemp.execute("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MTc3YTk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjcyOTY1MTI1LCJleHAiOjE2NzI5NjU3Mjl9.d9SayalbNOmXi8VcABf8_equJZVsi5TfDG8phLJ6eKc")

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.NEED_AUTHENTICATION))
    expect(result.statusCode).toBe(403)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if token is null", async () => {
    const result = await loginUseCase.execute(null)

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(loginUseCase.resources.get(strings.NEED_AUTHENTICATION))
    expect(result.statusCode).toBe(403)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })
})