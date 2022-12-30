import { createServer, Server } from "http"
import { AppWrapper } from "../AppWrapper"
import { settings } from "../../../application/shared/settings/AppSettings"

export class HttpServer {
  server: Server

  constructor(private appWrapper: AppWrapper) {
    this.server = createServer(this.appWrapper.app)
  }

  async start() {
    try {
      await this.appWrapper.initializeServices()
      this.server.listen(settings.Server.Port)
      this.server.on("listening", () => {
        console.log(`Serve Running on ${settings.Server.Host}:${settings.Server.Port}${settings.Server.Root}`)
      })
    } catch (e) { console.log(e) }
  }
}