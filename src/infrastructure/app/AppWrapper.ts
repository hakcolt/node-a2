import express, { Express, Router } from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import { BaseController } from "../../adapters/base/Base.controller"
import { AppSettings } from "../../application/shared/settings/AppSettings"
import configs from "../config"
import { resources, verifyToken, notFoundMiddleware, errorHandler } from "../middlewares"
import config from "../config"

export class AppWrapper {
  app: Express
  router: Router = Router()

  constructor(controllers: BaseController[]) {
    this.app = express()
    this.app.set("trust proxy", true)
    this.loadMiddleware()

    AppSettings.init(configs)

    if (controllers && controllers.length > 0) this.loadControllers(controllers)
  }

  loadMiddleware() {
    this.app
      .use(helmet())
      .use(resources)
    this.router
      .use(cors({
        credentials: true,
        origin(origin, callback) {
          if (config.Server.Origins.indexOf(origin!) !== -1 || !origin) // "!origin" allow REST tools and server-to-server requests
            callback(null, origin)
        },
        methods: ["GET", "POST", "PUT"]
      }))
      .use(cookieParser())
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(verifyToken)
  }

  loadControllers(controllers: BaseController[]) {
    controllers.forEach((controller) => controller.initializeRoutes(this.router))
    this.router.use(notFoundMiddleware)
    this.router.use(errorHandler)
    this.app.use(AppSettings.SERVER_API_PATH, this.router)
  }

  async initializeServices(): Promise<void> {
    // Initialize database service and other services here. For do it you should add a try catch block.
    // reject if any error with database or other service.
  }
}