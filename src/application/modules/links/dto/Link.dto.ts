import { plurals, Resources } from "../../../shared/locals"
import { Result } from "../../../shared/useCases/BaseUseCase"
import validation from "../../../shared/utils/Validation"

export class LinkInput {
  name: string | null
  path: string
  url: string
  userId: string
}

export class LinkDTO {
  id: string | null
  name: string | undefined
  path: string
  url: string
  userId: string

  static fromJSON(data: LinkInput): LinkDTO {
    const linkDto = new LinkDTO()
    linkDto.name = data.name ? data.name : undefined
    linkDto.path = data.path?.toLowerCase()
    linkDto.url = data.url?.toLowerCase()
    linkDto.userId = data.userId
    return linkDto
  }

  validateInputValues(result: Result, resources: Resources): boolean {
    const missingAttributes = validation.validateObject(this, ["path:string", "url:string"])

    if (missingAttributes.length) {
      result.setError(resources.getWithParams(plurals.MISSING_ATRIBUTES, validation.formatMissingAttributes(missingAttributes)), 400)
      return false
    }

    const invalidAttributes: string[] = []

    if (!validation.validatePath(this.path)) invalidAttributes.push("path: string")
    const checkedUrl = validation.validateUrl(this.url)
    if (!checkedUrl) invalidAttributes.push("url: string")
    this.url = checkedUrl!

    if (invalidAttributes.length > 0) {
      result.setError(resources.getWithParams(plurals.INVALID_ATTRIBUTES, invalidAttributes.join(", ")), 400)
      return false
    }
    return true
  }
}
