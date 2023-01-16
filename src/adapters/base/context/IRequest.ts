import { Resources } from "@hakcolt/resources"
import { Request } from "express"
import { TokenArgs } from "../../../domain/session/TokenArgs"

export interface IRequest extends Request {
  resources: Resources
  userInfo: TokenArgs
}