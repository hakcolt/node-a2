import { AppWrapper } from "./infrastructure/app/AppWrapper"
import { HttpServer } from "./infrastructure/app/server/HttpServer"

import userController from "./adapters/controllers/User.controller"
import authController from "./adapters/controllers/Auth.controller"
import healthController from "./adapters/controllers/Health.controller"
import linkController from "./adapters/controllers/Link.controller"

import { Router } from "express"
import config from "./infrastructure/config"
import rootController from "./adapters/controllers/Root.controller"

const root = {
  path: "/",
  router: Router(),
  controllers: [rootController]
}

const api = {
  path: config.Server.ApiPath,
  router: Router(),
  controllers: [userController, authController, linkController, healthController]
}

const app = new AppWrapper(root, api)
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