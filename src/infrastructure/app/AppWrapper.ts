import express, { Express, Router } from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import { BaseController } from "../../adapters/base/Base.controller"
import { AppSettings } from "../../application/shared/settings/AppSettings"
import { resources, verifyToken, notFoundMiddleware, errorHandler } from "../middlewares"
import config from "../config"

export interface ServerInput { path: string, router: Router, controllers: BaseController[] }

export class AppWrapper {
  app: Express

  constructor(root: ServerInput, api: ServerInput) {
    this.app = express()
    this.app.set("trust proxy", true)

    this.loadMiddleware(api)

    AppSettings.init(config)

    if (api.controllers.length > 0) {
      const router = api.router
      api.controllers.forEach((controller) => controller.initializeRoutes(router))
      router.use(notFoundMiddleware)
      this.app.use(api.path, router)
    }

    if (root.controllers.length > 0) {
      root.controllers.forEach((controller) => controller.initializeRoutes(root.router))
      this.app.use("/", root.router)
    }
    this.app.use(errorHandler)
  }

  loadMiddleware(component: ServerInput) {
    this.app
      .use(helmet())
      .use(cors())
      .use(resources)
    component.router
      .use(cors({
        credentials: true,
        origin(origin, callback) {
          // if (config.Server.Origins.indexOf(origin!) !== -1 || !origin) // "!origin" allow REST tools and server-to-server requests
          console.log(origin)
          callback(null, origin)
        },
        methods: ["GET", "POST", "PUT"]
      }))
      .use(cookieParser())
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(verifyToken)
  }

  async initializeServices(): Promise<void> {
    // Initialize database service and other services here. For do it you should add a try catch block.
    // reject if any error with database or other service.
  }
}