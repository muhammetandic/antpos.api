import express, { Router } from "express";
import { todoRoutes } from "./features/todo/routes.js";
import { authRoutes } from "./features/auth/routes.js";
import { authMiddleware } from "./middlewares/auth.js";
import { addressRoutes } from "./features/address/routes.js";

export const routes = express.Router();
const apiRoutes: Router = express.Router();

apiRoutes.use(authMiddleware);
apiRoutes.use("/todos", todoRoutes);
apiRoutes.use("/addresses", addressRoutes);

routes.use("/auth", authRoutes);
routes.use("/api", apiRoutes);

routes.get("/health-check", (_, res) => {
  res.json({ success: true, message: "Server is healthy" });
});
