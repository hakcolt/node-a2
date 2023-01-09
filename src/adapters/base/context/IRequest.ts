import { Resources } from "@hakcolt/resources"
import { Request } from "express"

export interface IRequest extends Request {
  resources: Resources
}