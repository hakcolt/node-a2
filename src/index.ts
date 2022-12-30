import { BaseController } from "./adapters/base/Base.controller"
import userController from "./adapters/controllers/User.controller"
import { AppWrapper } from "./infrastructure/app/AppWrapper"
import { HttpServer } from "./infrastructure/app/server/HttpServer"

const controllers: BaseController[] = [userController]

const app = new AppWrapper(controllers)
const server = new HttpServer(app)
server.start()

/* TODO:
 process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
  errorHandlerMiddleware.manageNodeException("UncaughtException", error);
});

process.on("unhandledRejection", (reason: NodeJS.UnhandledRejectionListener) => {
  errorHandlerMiddleware.manageNodeException("UnhandledRejection", reason);
});
*/