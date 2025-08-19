import express from "express";
import {
  checkAuth,
  deleteAccount,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/profile", protectedRoute, updateProfile);
router.delete("/profile", protectedRoute, deleteAccount);
router.get("/check", protectedRoute, checkAuth);

export default router;
