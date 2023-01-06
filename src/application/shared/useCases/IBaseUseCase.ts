import { Result } from "./Result"

export interface IBaseUseCase {
  execute(data: any): Promise<Result>
}