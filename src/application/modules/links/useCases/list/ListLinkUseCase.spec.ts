import config from "../../../../../infrastructure/config"
import { LocalLinkRepository } from "../../../../../adapters/repositories/local/Link.repository"
import { createResource, strings } from "../../../../shared/locals"
import { AppSettings } from "../../../../shared/settings/AppSettings"
import { describe, beforeAll, it, expect } from "vitest"
import { ListLinkUseCase } from "."

AppSettings.init(config)

describe("when try get link", () => {
  let listLinkUseCase: ListLinkUseCase
  
  beforeAll(() => {
    const repo = new LocalLinkRepository()
    listLinkUseCase = new ListLinkUseCase(createResource(), repo)
  })

  it("should return status 200 if there is not any problem", async () => {
    const userInfo = {
      email: "test@hakcolt.com",
      id: "9177a65d-6f83-478d-954d-10be5a2df24d"
    }
    const result = await listLinkUseCase.execute(userInfo)
    
    expect(result.error).toBeUndefined()
    expect(result.message).toBe(listLinkUseCase.resources.get(strings.SUCCESSFUL_OPERATION))
    expect(result.statusCode).toBe(200)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if input is wrong", async () => {
    const result = await listLinkUseCase.execute({
      email: "hakcolt@mamacom",
      id: "haha"
    })

    expect(result.message).toBe(listLinkUseCase.resources.get(strings.EMPTY_LIST))
    expect(result.error).toBeUndefined()
    expect(result.statusCode).toBe(200)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 403 if token is invalid", async () => {
    const result = await listLinkUseCase.execute({
      email: "hakcolt@mama.com",
      id: "haha"
    })

    expect(result.message).toBe(listLinkUseCase.resources.get(strings.EMPTY_LIST))
    expect(result.error).toBeUndefined()
    expect(result.statusCode).toBe(200)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBeUndefined()
  })
})