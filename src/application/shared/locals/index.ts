import { Resources } from "@hakcolt/resources"
import LocaleType from "./LocaleType.enum"
import enLocal from "./en.local"
import { strings, plurals } from "./keys"

const locals = {
  [LocaleType.EN]: enLocal
}

const keys = Object.values(strings).concat(Object.values(plurals))

const createResource = () => new Resources(locals, keys, LocaleType.EN)

export { createResource, Resources, LocaleType, strings, plurals }