import { Result } from "../../../shared/useCases/Result"
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

  validate(result: Result): boolean {
    if (!this.email && !this.password) {
      result.setError("Need authentication", 400)
      return false
    }
    const missingAttributes = validation.validateObject(this, ["email:string", "password:string"])

    if (missingAttributes) {
      result.setError("Missing attributes: " + missingAttributes, 400)
      return false
    }

    if (this.password.length < 6) {
      result.setError("Email or password incorrect", 403)
      return false
    }
    return true
  }
}