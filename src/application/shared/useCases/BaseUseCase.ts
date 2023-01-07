import { createResource, LocaleType, Resources } from "../locals"
import { Result, ResultData } from "@hakcolt/result"


export {Result, ResultData}

export abstract class BaseUseCase {
  resources: Resources
  locale: LocaleType

  constructor() {
    this.resources = createResource()
  }

  setLanguage(locale: LocaleType) {
    if (Object.values(LocaleType).includes(locale))
      this.resources.setLanguage(locale)
  }

  abstract execute(locale: LocaleType, data: any): Promise<Result>
}