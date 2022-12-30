import { v4 } from "uuid"


export class UuidUtil {
  getV4 = v4

  getV4WithoutDashes = () => v4().replace(/-/g, "")
}

export default new UuidUtil()