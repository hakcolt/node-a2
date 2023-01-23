import { Validation as Va } from "@hakcolt/validator"


export class Validation {
  private validator = new Va()

  validatePath(path: string): boolean {
    return this.validator.validateURLPath(path)
  }

  validateUrl(url: string): string | null {
    return this.validator.validateUrl(url)
  }

  validateObject(obj: any, attributesParam: string[]): string[] {
    return this.validator.validateObject(obj, attributesParam)
  }

  formatMissingAttributes(missingAttributes: string[]): string {
    const attrFormated = missingAttributes.map(item => item.replace(":", ": "))
    return attrFormated.join(", ")
  }

  validateEmail(email: string): boolean {
    return this.validator.validateEmail(email)
  }

  /**
   * The password must contain least at one upper case and one lower case letter, one digit and a length of least at 8 characters 
   */
  validatePassword(password: string): boolean {
    return this.validator.validatePassword(password)
  }
}

export default new Validation()