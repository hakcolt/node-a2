import express, { Express, Router, json } from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { BaseController } from "../../adapters/base/Base.controller"
import { AppSettings } from "../../application/shared/settings/AppSettings"
import configs from "../config"
import { errorHandler } from "../middlewares/error"
import { notFoundMiddleware } from "../middlewares/404"

export class AppWrapper {
  app: Express

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
    .use(cookieParser())
    .use(json())
  }

  loadControllers(controllers: BaseController[]) {
    const router = Router()
    controllers.forEach((controller) => controller.initializeRoutes(router))
    router.use(notFoundMiddleware)
    router.use(errorHandler)
    this.app.use(AppSettings.SERVER_ROOT, router)
  }

  async initializeServices(): Promise<void> {
    // Initialize database service and other services here. For do it you should add a try catch block.
    // reject if any error with database or other service.
  }
}