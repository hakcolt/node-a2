export class ApplicationError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message)
  }
}