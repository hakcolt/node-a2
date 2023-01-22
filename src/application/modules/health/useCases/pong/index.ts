import { BaseUseCase } from "../../../../shared/useCases/BaseUseCase"
import { Result } from "../../../../shared/useCases/BaseUseCase"
import { Resources, plurals } from "../../../../shared/locals"

export class PongUseCase extends BaseUseCase {
  constructor(resources: Resources) {
    super(resources)
  }

  override async execute(): Promise<Result> {
    const result = new Result()
    result.setMessage(this.resources.getWithParams(plurals.SERVICE_ONLINE, new Date().toISOString(), "200"), 200)
    return result
  }
}