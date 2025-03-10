import { Router } from "express"
import getDroneById from "../controllers/drone/getDroneId"
import getAllDrones from "../controllers/drone/getAllDrone"
import getAllDronesPositions from "../controllers/drone/getAllDronePositions"

const droneRouter = (app: Router) => {
  const router = Router()

  router.get('/allDrones', getAllDrones)
  router.get("/:deviceId", getDroneById)
  router.get('/dronesPositions', getAllDronesPositions)

  app.use('/mqtt', router)
}

export default droneRouter