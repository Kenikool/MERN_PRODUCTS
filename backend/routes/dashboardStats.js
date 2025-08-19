import express from "express";
import { getDashboardStats } from "../controllers/statsController.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", protectedRoute, getDashboardStats);
export default router;
