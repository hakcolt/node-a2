export class ApplicationError extends Error {
  constructor(message: string, readonly statusCode: number, stack?: string) {
    super(message)
    if (stack) this.stack = stack
  }
}