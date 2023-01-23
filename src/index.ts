import { BaseController } from "./adapters/base/Base.controller"
import { AppWrapper } from "./infrastructure/app/AppWrapper"
import { HttpServer } from "./infrastructure/app/server/HttpServer"

import userController from "./adapters/controllers/User.controller"
import authController from "./adapters/controllers/Auth.controller"
import healthController from "./adapters/controllers/Health.controller"
import linkController from "./adapters/controllers/Link.controller"

const controllers: BaseController[] = [userController, authController, linkController, healthController]

const app = new AppWrapper(controllers)
const server = new HttpServer(app)
server.start()

/* TODO:
 process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
  console.log("uncaughtException")
});

process.on("unhandledRejection", (reason: NodeJS.UnhandledRejectionListener) => {
  console.log("unhandledRejection")
});
*/