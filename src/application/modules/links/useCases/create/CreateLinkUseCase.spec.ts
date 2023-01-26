import { beforeAll, describe, expect, it } from "vitest"
import { createResource, plurals, strings } from "../../../../shared/locals"
import { URLConstraint } from "../../../../shared/settings/Constraints"
import { CreateLinkUseCase } from "."
import { LocalLinkRepository } from "../../../../../adapters/repositories/local/Link.repository"
import { LocalUserRepository } from "../../../../../adapters/repositories/local/User.repository"

describe("when try to create link", () => {
  let createLinkUseCase: CreateLinkUseCase

  beforeAll(() => {
    const linkRepo = new LocalLinkRepository()
    const userRepo = new LocalUserRepository()
    createLinkUseCase = new CreateLinkUseCase(createResource(), linkRepo, userRepo)
  })

  it("should return 201 if link was created", async () => {
    const result = await createLinkUseCase.execute({
      "name": "Instagram",
      "path": "/instagram",
      "url": "https://instagram.com/hakcolt",
      "userId": "9177a65d-6f83-478d-954d-10be5a2df24d"
    })

    expect(result.error).toBeUndefined()
    expect(result.message).toBe(createLinkUseCase.resources.get(strings.SUCCESSFUL_OPERATION))
    expect(result.statusCode).toBe(201)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBe(URLConstraint.Links.List.path)
  })

  it("should return a 400 error if URL and path is invalid", async () => {
    const result = await createLinkUseCase.execute({
      "name": "Instagram",
      "path": "instagram",
      "url": "htps://instagramcom/hakcolt",
      "userId": "9177a65d-6f83-478d-954d-10be5a2df24d"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(createLinkUseCase.resources.getWithParams(plurals.INVALID_ATTRIBUTES, "path: string, url: string"))
    expect(result.statusCode).toBe(400)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return a 403 error if link already exists", async () => {
    const linkToPush = {
      "name": "Github",
      "path": "/github",
      "url": "https://github.com/hakcolt",
      "userId": "9177a65d-6f83-478d-954d-10be5a2df24d"
    }
    const createUser = async () => createLinkUseCase.execute(linkToPush)

    const result = await createUser()
    expect(result.message).toBe(createLinkUseCase.resources.get(strings.SUCCESSFUL_OPERATION))
    expect(result.error).toBeUndefined()
    expect(result.statusCode).toBe(201)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBe(URLConstraint.Links.List.path)


    const result2 = await createUser()
    expect(result2.error).toBe(createLinkUseCase.resources.getWithParams(plurals.LINK_ALREADY_EXISTS, linkToPush.path))
    expect(result2.message).toBeUndefined()
    expect(result2.statusCode).toBe(409)
    expect(result2.isSuccess).toBeFalsy()
    expect(result2.next).toBeUndefined()
  })

  it("should return a 400 error if attribute is missing", async () => {
    const result = await createLinkUseCase.execute({
      "name": "Instagram",
      "url": "https://instagram.com/hakcolt"
    })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(createLinkUseCase.resources.getWithParams(plurals.MISSING_ATRIBUTES, "path: string, userId: string"))
    expect(result.statusCode).toBe(400)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })
})
