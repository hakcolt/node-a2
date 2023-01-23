import { ILink } from "./ILink"

export class Link implements ILink {
  id: string
  name: string
  path: string
  url: string
  userId: string
}