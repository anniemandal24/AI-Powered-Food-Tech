import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  changePassword,
  logoutUser
} from "../controllers/auth.controller.js";
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js";

const router = Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

router.post("/change-password", jwtAuthMiddleware, changePassword);
router.post("/logout", jwtAuthMiddleware, logoutUser);

export default router;