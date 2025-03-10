import { Router } from "express";
import { register } from "../controllers/auth/register-controller";
import login from "../controllers/auth/login-controller";
import { logout } from "../controllers/auth/logout-controllers";

const accountRoutes = (app:Router) => {
  const router = Router();

  router.post("/register", register);
  router.post("/login", login);
  router.post("/logout",logout);
  router.put("/password",)

  app.use("/account", router)
}

export default accountRoutes