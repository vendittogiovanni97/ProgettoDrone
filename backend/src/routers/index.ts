import { Router, Express} from "express"
import accountRoutes from "./accountRouter";
import droneRouter from "./droneRouter";

const addRoutes = (app: Express) => {
  const router = Router();
  
  accountRoutes(router);
  droneRouter(router)

  app.use("/rest", router);
}

export default addRoutes;