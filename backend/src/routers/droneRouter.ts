import { Router } from "express"
import getDroneById from "../controllers/drone/getDrone"

const droneRouter = (app: Router) => {
  const router = Router()

  router.get("/:deviceId", getDroneById)

  app.use('/mqtt', router)
}

export default droneRouter