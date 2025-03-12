import { Router } from "express";
import getDroneById from "../controllers/drone/getDroneId";
import getAllDrones from "../controllers/drone/getAllDrone";
import getAllDronesPositions from "../controllers/drone/getAllDronePositions";

const droneRouter = (app: Router) => {
  const router = Router();

  router.get("/allDrones", getAllDrones); //rest/mqtt/allDrones----Ottiene tutti i droni
  router.get("/:deviceId", getDroneById); //rest/mqtt/:deviceId---Ottiene un drone specifico

  router.get("/dronesPositions", getAllDronesPositions); //rest/mqtt/dronesPositions---Ottiene posizioni

  app.use("/mqtt", router);
};

export default droneRouter;
