import { LocaleType, Resources } from "../locals"
import { Result, ResultData } from "@hakcolt/result"
export { Result, ResultData }

export abstract class BaseUseCase {

  constructor(readonly resources: Resources) { }

  setLanguage(locale: LocaleType) {
    if (Object.values(LocaleType).includes(locale)) this.resources.language = locale
  }

  abstract execute(data: any): Promise<Result>
}