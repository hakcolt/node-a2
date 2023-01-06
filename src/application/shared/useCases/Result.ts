export class Result {
  statusCode: number
  message: string
  error: string
  isSucess: boolean

  setMessage(message: string, statusCode: number) {
    this.message = message
    this.statusCode = statusCode
    this.isSucess = true
  }

  setError(error: string, statusCode: number) {
    this.error = error
    this.statusCode = statusCode
    this.isSucess = false
  }
}

export class ResultData<T> extends Result {
  cookie: { name: string, value: string } | undefined
  data: T
}