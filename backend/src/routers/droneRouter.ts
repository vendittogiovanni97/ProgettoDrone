import { Router } from "express"
import getDroneById from "../controllers/drone/getDroneId"
import getAllDrones from "../controllers/drone/getAllDrone"

const droneRouter = (app: Router) => {
  const router = Router()

  router.get('/allDrones', getAllDrones)
  router.get("/:deviceId", getDroneById)

  app.use('/mqtt', router)
}

export default droneRouter