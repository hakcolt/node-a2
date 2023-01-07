import { ResultData } from "../../../../shared/useCases/BaseUseCase"
import { beforeAll, describe, expect, it } from "vitest"
import { AuthProvider } from "../../../../../adapters/providers/Auth.provider"
import { LocalUserRepository } from "../../../../../adapters/repositories/local/user/User.repository"
import config from "../../../../../infrastructure/config"
import dbMock from "../../../../../infrastructure/databases/local/db.mock"
import { LocaleType, strings } from "../../../../shared/locals"
import { AppSettings } from "../../../../shared/settings/AppSettings"
import { LogoutUserUseCase } from "./"

AppSettings.init(config)
AppSettings.JWT_LONG_SESSION_KEY = "1234"
AppSettings.JWT_REFRESH_SESSION_KEY = "4321"

describe("when try to log out user", () => {
  let logoutUseCase: LogoutUserUseCase
  let auth: AuthProvider
  
  beforeAll(() => {
    const repo = new LocalUserRepository()
    auth = new AuthProvider()
    logoutUseCase = new LogoutUserUseCase(repo, auth)
  })
  
  it("should return status 200 if there is not any problem", async () => {
    const session = auth.getJWT({
      email: "test@hakcolt.com",
      uid: "9177a65d-6f83-478d-954d-10be5a2df24d"
    }, true)
    dbMock.users[1].token = session.token
    const result = await logoutUseCase.execute(LocaleType.EN, session.token)

    const resultData = (result as ResultData<unknown>)
    const cookie = resultData.cookie
    expect(result.error).toBeUndefined()
    expect(result.message).toBe(logoutUseCase.resources.get(strings.USER_DISCONNECTED))
    expect(result.statusCode).toBe(200)
    expect(result.isSucess).toBeTruthy()
    expect(resultData.data).toBe(undefined)
    expect(cookie?.name).toBe("SESSION_TOKEN")
    expect(cookie?.value).toBe(null)
  })

  it("should return status 409 if input is wrong", async () => {
    const result = await logoutUseCase.execute(LocaleType.EN, "eyJhbGciOiJIUzINiIsInR5cCI6IkpXVCJ9.eyJ1aQiOiI5MTc3Yk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjcyY0MjA2LCJleHAiOjE2NzI5NjQ4MT9.S_S_UtZn1-0kMiQPSPATzatSYmeDkLCHVP9R8P0")

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(logoutUseCase.resources.get(strings.NO_USER_LOGGED_IN))
    expect(result.statusCode).toBe(409)
    expect(result.isSucess).toBeFalsy()
  })

  it("should return nothing if token is valid but it expires or changed", async () => {
    const repositoryTemp = new LocalUserRepository()
    const authProviderTemp = new AuthProvider()

    authProviderTemp.verifyJWT = () => true
  
    const logoutUserCaseTemp = new LogoutUserUseCase(repositoryTemp, authProviderTemp)
    const result = await logoutUserCaseTemp.execute(LocaleType.EN, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MTc3YTk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjcyOTY1MTI1LCJleHAiOjE2NzI5NjU3Mjl9.d9SayalbNOmXi8VcABf8_equJZVsi5TfDG8phLJ6eKc")

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(logoutUseCase.resources.get(strings.NO_USER_LOGGED_IN))
    expect(result.statusCode).toBe(409)
    expect(result.isSucess).toBeFalsy()
  })

  it("should return nothing if token is null", async () => {
    const result = await logoutUseCase.execute(LocaleType.EN, null)

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(logoutUseCase.resources.get(strings.NO_USER_LOGGED_IN))
    expect(result.statusCode).toBe(409)
    expect(result.isSucess).toBeFalsy()
  })
})