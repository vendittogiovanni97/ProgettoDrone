import { Router, Express} from "express"
import accountRoutes from "./accountRouter";

const addRoutes = (app: Express) => {
  const router = Router();
  
  accountRoutes(router);

  app.use("/rest", router);
}

export default addRoutes;