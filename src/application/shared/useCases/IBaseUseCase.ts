import { Result } from "./Result"

export interface IBaseUseCase<T> {
  execute(data): Promise<T>
}