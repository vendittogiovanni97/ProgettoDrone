import { Router } from "express";
import getDroneById from "../controllers/drone/getDroneId";
import getAllDrones from "../controllers/drone/getAllDrone";
import getAllDronesPositions from "../controllers/drone/getAllDronePositions";
import getDroneHistory from "../controllers/drone/getDroneHistory";
import getDroneTrackById from "../controllers/drone/getTrackId";

const droneRouter = (app: Router) => {
  const router = Router();

  router.get("/allDrones", getAllDrones); //rest/mqtt/allDrones----Ottiene tutti i droni
  router.get("/deviceId/:deviceId", getDroneById); //rest/mqtt/:deviceId---Ottiene un drone specifico

  router.get("/dronesPositions", getAllDronesPositions); //rest/mqtt/dronesPositions---Ottiene posizioni

  router.get("/historyDrone", getDroneHistory); //rest/mqtt/historyDrone --- Ottiene tutto lo storico dei droni

  router.get("/track/:uniqueId", getDroneTrackById); //rest/mqtt/track/:uniqueId --- Ottiene la tratta della missione

  app.use("/mqtt", router);
};

export default droneRouter;
