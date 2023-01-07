export interface IResponse {
  cookie(name: string, val: any): IResponse
  status(code: number): IResponse;
  send(body: unknown): IResponse;
  json(body: unknown): IResponse;
  setHeader(name: string, value: number | string): this;
}