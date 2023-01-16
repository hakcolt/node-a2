import { LocalUserRepository } from "../../../../../adapters/repositories/local/user/User.repository"
import config from "../../../../../infrastructure/config"
import { createResource, strings } from "../../../../shared/locals"
import { AppSettings } from "../../../../shared/settings/AppSettings"
import { GetUserUseCase } from "."
import { URLConstraint } from "../../../../shared/settings/Constraints"
import { describe, beforeAll, it, expect } from "vitest"

AppSettings.init(config)

describe("when try refresh access token", () => {
  let getUserUseCase: GetUserUseCase
  
  beforeAll(() => {
    const repo = new LocalUserRepository()
    getUserUseCase = new GetUserUseCase(createResource(), repo)
  })

  it("should return status 200 if there is not any problem", async () => {
    const userInfo = {
      email: "test@hakcolt.com",
      id: "e66832e3-fa0c-4502-a1a2-752229249a18"
    }
    const result = await getUserUseCase.execute(userInfo)
    
    expect(result.error).toBeUndefined()
    expect(result.message).toBe(getUserUseCase.resources.get(strings.SUCCESSFUL_OPERATION))
    expect(result.statusCode).toBe(200)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if input is wrong", async () => {
    const result = await getUserUseCase.execute({
      email: "hakcolt@mamacom",
      id: "haha"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(getUserUseCase.resources.get(strings.NEED_AUTHENTICATION))
    expect(result.statusCode).toBe(403)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBe(URLConstraint.Users.SignIn.address)
  })

  it("should return status 403 if token is invalid", async () => {
    const result = await getUserUseCase.execute({
      email: "hakcolt@mama.com",
      id: "haha"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(getUserUseCase.resources.get(strings.NEED_AUTHENTICATION))
    expect(result.statusCode).toBe(403)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBe(URLConstraint.Users.SignIn.address)
  })
})