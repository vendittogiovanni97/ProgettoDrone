import { Router } from "express";
import { logout } from "../controllers/auth/logout-controllers";


const accountRoutes = (app:Router) => {
  const router = Router();

  router.post("/register",);
  router.post("/login", );
  router.post("/logout",logout);
  router.put("/password",)

  app.use("/account", router)
}

export default accountRoutes