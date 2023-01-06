export class Validation {
  validateObject(obj: any, attributesParam: string[]): string {
    const validateSyntax = /^[a-z]([\w\d-]*[a-z\d])?:[a-z]+$/i
    const attributes = attributesParam.filter(value => validateSyntax.test(value))
    
    const missingAttributes: string[] = []
    for (const attributeSet of attributes) {
      const [attributeName, attributeType] = attributeSet.split(":")
      const attributeValue = obj[attributeName]
      if (!attributeValue || typeof attributeValue !== attributeType)
        missingAttributes.push(attributeSet)
    }

    const result = this.formatOutput(missingAttributes)
    return result.join(", ")
  }

  formatOutput(attributes: string[]): string[] {
    if (attributes.length > 0) return attributes.map(attr => attr.replace(":", ": "))
    else return attributes
  }
}

export default new Validation()