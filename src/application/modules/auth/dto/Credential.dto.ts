import { strings, plurals, Resources } from "../../../shared/locals"
import { Result } from "../../../shared/useCases/BaseUseCase"
import validation from "../../../shared/utils/Validation"

export class CredentialDTO {
  email: string
  password: string

  static fromJSON(data: Record<string, any>): CredentialDTO {
    const credentialDTO = new CredentialDTO()
    credentialDTO.email = data.email
    credentialDTO.password = data.password
    return credentialDTO
  }

  validate(result: Result, resource: Resources): boolean {
    const missingAttributes = validation.validateObject(this, ["email:string", "password:string"])

    if (missingAttributes.length) {
      result.setError(resource.getWithParams(plurals.MISSING_ATRIBUTES, validation.formatMissingAttributes(missingAttributes)), 400)
      return false
    }

    if (!validation.validateEmail(this.email)) {
      result.setError(resource.get(strings.EMAIL_PASSWORD_INVALID), 403)
      return false
    }

    if (!validation.validatePassword(this.password)) {
      result.setError(resource.get(strings.EMAIL_PASSWORD_INVALID), 403)
      return false
    }
    
    return true
  }
}