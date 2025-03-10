import { Router } from "express";

const accountRoutes = (app:Router) => {
  const router = Router();

  router.post("/register", );
  router.post("/login", );
  router.post("/logout",);
  router.put("/password",)

  app.use("/account", router)
}

export default accountRoutes