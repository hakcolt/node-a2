import { ILink } from "../../../../domain/link/ILink"
import { Link } from "../../../../domain/link/Link"

export interface ILinkRepository {
  update(where: Record<string, any>, attributes: Record<string, any>): Promise<Link | null>
  fetchBy(where: Record<string, any>): Promise<Link | null>
  fetchListBy(email: Record<string, any>): Promise<Link[] | null>
  create(link: ILink): Promise<Link | null>
}