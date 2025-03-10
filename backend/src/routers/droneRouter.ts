import { Router } from "express"

const droneRouter = (app: Router) => {
  const router = Router()

  app.use('/mqtt', router)
}

export default droneRouter