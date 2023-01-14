export class ApplicationError extends Error {
  constructor(message: string, readonly statusCode: number, stack?: string) {
    super(message)
    this.stack = stack
  }
}