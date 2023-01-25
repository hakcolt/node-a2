import { BaseUseCase, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { plurals, Resources, strings } from "../../../../shared/locals"
import { URLConstraint } from "../../../../shared/settings/Constraints"
import { ILinkRepository } from "../../providerContracts/ILink.repository"
import { LinkDTO, LinkInput } from "../../dto/Link.dto"
import { IUserRepository } from "../../../users/providerContracts/IUser.repository"
import { ILink } from "../../../../../domain/link/ILink"
import { Link } from "../../../../../domain/link/Link"

export class CreateLinkUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly linkRepository: ILinkRepository,
    private readonly userRepository: IUserRepository
  ) {
    super(resources)
  }

  override async execute(data: any): Promise<ResultData<Link>> {
    const result = new ResultData<Link>()
    const linkDTO: LinkDTO = LinkDTO.fromJSON(data as LinkInput)

    if (!linkDTO.validateInputValues(result, this.resources)) return result

    const hasUser = await this.userRepository.fetchBy({ id: data.userId })
    if (!hasUser) {
      result.setError(this.resources.get(strings.NOT_FOUND), 400)
      return result
    }

    const hasLink = await this.linkRepository.fetchBy({ path: linkDTO.path })
    if (hasLink) {
      result.setError(this.resources.getWithParams(plurals.LINK_ALREADY_EXISTS, linkDTO.path), 409)
      return result
    }

    await this.createLink(result, linkDTO as ILink)

    return result
  }

  async createLink(result: ResultData<Link>, data: ILink) {
    const link = await this.linkRepository.create(data)

    if (link) {
      result.setMessage(this.resources.get(strings.SUCCESSFUL_OPERATION), 201, URLConstraint.Links.List.path)
      result.data = link
    }
    else result.setError(this.resources.get(strings.SOMETHING_WAS_WRONG), 409)
  }
}