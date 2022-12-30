export class Result<T> {
  statusCode: number
  message: string
  error: Error | string
  data: T

  setMessage(message: string, statusCode: number) {
    this.message = message
    this.statusCode = statusCode
  }

  setError(error: Error, statusCode: number) {
    this.error = error
    this.statusCode = statusCode
  }
}