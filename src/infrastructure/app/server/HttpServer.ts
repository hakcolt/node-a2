import { createServer, Server } from "http"
import { AppWrapper } from "../AppWrapper"
import { AppSettings } from "../../../application/shared/settings/AppSettings"

export class HttpServer {
  server: Server

  constructor(private appWrapper: AppWrapper) {
    this.server = createServer(this.appWrapper.app)
  }

  async start() {
    try {
      await this.appWrapper.initializeServices()
      this.server.listen(AppSettings.SERVER_PORT)
      this.server.on("listening", () => {
        console.log(`Serve Running on ${AppSettings.SERVER_HOST}:${AppSettings.SERVER_PORT}${AppSettings.SERVER_API_PATH}`)
      })
    } catch (e) { console.log(e) }
  }
}