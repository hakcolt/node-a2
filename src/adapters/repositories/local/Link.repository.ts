import { ILinkRepository } from "../../../application/modules/links/providerContracts/ILink.repository"
import { ILink } from "../../../domain/link/ILink"
import { Link } from "../../../domain/link/Link"
import linkModel from "../../../infrastructure/databases/local/Link.model"

export class LocalLinkRepository implements ILinkRepository {
  async fetchListBy(where: Record<string, any>): Promise<Link[]> {
    const linkList = linkModel.getBy(where)
    if (!linkList) return []
    return linkList
  }
  async update(where: Record<string, any>, attributes: Record<string, any>): Promise<Link | null> {
    const linkList = linkModel.getBy(where)
    if (!linkList || linkList.length < 1) return null

    const link = linkList[0]
    const linkKeys = Object.keys(link)
    const attrKeys = Object.keys(attributes)

    for (const keyToUpdate of attrKeys) {
      if (!linkKeys.includes(keyToUpdate)) return null
      link[keyToUpdate] = attributes[keyToUpdate]
    }

    return linkModel.update(link)
  }

  async fetchBy(where: Record<string, any>): Promise<Link | null> {
    const linkList = linkModel.getBy(where)
    if (!linkList || linkList.length < 1) return null
    return linkList[0]
  }

  async create(linkData: ILink): Promise<Link | null> {
    return linkModel.create(linkData)
  }
}

