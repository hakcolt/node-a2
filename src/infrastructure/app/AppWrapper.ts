import express, { Express, Router, json } from "express"
import { BaseController } from "../../adapters/base/Base.controller"
import helmet from "helmet"
import { settings } from "../../application/shared/settings/AppSettings"

export class AppWrapper {
  app: Express

  constructor(controllers: BaseController[]) {
    this.app = express()
    this.app.set("trust proxy", true)
    this.loadMiddleware()

    if (controllers && controllers.length > 0) this.loadControllers(controllers)
  }

  loadMiddleware() {
    this.app
    .use(helmet())
    .use(json())
  }

  loadControllers(controllers: BaseController[]) {
    controllers.forEach((controller) => {
      const router = Router()
      controller.initializeRoutes(router)
      this.app.use(settings.Server.Root, router)
    })

    // TODO: this.app.use()
  }

  async initializeServices(): Promise<void> {
    // Initialize database service and other services here. For do it you should add a try catch block.
    // reject if any error with database or other service.
  }
}