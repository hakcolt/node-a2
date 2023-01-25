import { BaseUseCase, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { Result } from "../../../../shared/useCases/BaseUseCase"
import { Resources, strings } from "../../../../shared/locals"
import { TokenArgs } from "../../../../../domain/session/TokenArgs"
import { ILinkRepository } from "../../providerContracts/ILink.repository"
import { Link } from "@prisma/client"

export class ListLinkUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: ILinkRepository
  ) {
    super(resources)
  }

  override async execute(userInfo: TokenArgs): Promise<Result> {
    const result = new ResultData<Link[]>()

    const link = await this.repository.fetchListBy({ userId: userInfo.id })
    if (!link) {
      result.setMessage(this.resources.get(strings.EMPTY_LIST), 200)
      return result
    }

    result.setMessage(this.resources.get(strings.SUCCESSFUL_OPERATION), 200)
    result.data = link
    return result
  }
}