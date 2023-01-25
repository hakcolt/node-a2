import { BaseUseCase, ResultData } from "../../../../shared/useCases/BaseUseCase"
import { Result } from "../../../../shared/useCases/BaseUseCase"
import { Resources, strings } from "../../../../shared/locals"
import { URLConstraint } from "../../../../shared/settings/Constraints"
import { ILinkRepository } from "../../../links/providerContracts/ILink.repository"
import { AppSettings } from "../../../../shared/settings/AppSettings"

export class RedirectUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: ILinkRepository
  ) {
    super(resources)
  }

  override async execute(path: string): Promise<Result> {
    const result = new ResultData<string>()

    const link = await this.repository.fetchBy({ path })
    if (!link) {
      result.setError(
        this.resources.get(strings.NOT_FOUND),
        404, AppSettings.SERVER_API_PATH + URLConstraint.Users.SignIn.path
      )
      return result
    }

    result.setMessage(this.resources.get(strings.SUCCESSFUL_OPERATION), 302)
    result.data = link.url
    return result
  }
}