import { Router } from "express";
import register from "../controllers/auth/register-controller";
import login from "../controllers/auth/login-controller";


const accountRoutes = (app:Router) => {
  const router = Router();

  router.post("/register", register);
  router.post("/login", login);
  router.post("/logout",);
  router.put("/password",)

  app.use("/account", router)
}

export default accountRoutes