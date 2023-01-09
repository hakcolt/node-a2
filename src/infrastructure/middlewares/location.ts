import { NextFunction, Request, Response } from "express"
import { IRequest } from "../../adapters/base/Base.controller"
import { createResource, LocaleType } from "../../application/shared/locals"

export function resources(request: Request, res: Response, next: NextFunction) {
  const req = request as IRequest

  let acceptLanguages = req.headers["accept-language"] as LocaleType

  const resources = createResource()
  req.resources = resources

  const acceptLanguagesList: string[] | undefined = acceptLanguages?.split(";")
  if (acceptLanguagesList?.length > 0)
    for (const languageSet of acceptLanguagesList) {
      const localeMatched = Object.values(LocaleType).find(locale => languageSet.includes(locale))
      if (localeMatched) {
        resources.language = localeMatched
        break
      }
    }
  next()
}