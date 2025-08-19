import express from "express";
import {
  createProduct,
  deleteProducts,
  getAllProducts,
  getProductById,
  updateProducts,
} from "../controllers/product.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createReview,
  getProductReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", protectedRoute, createProduct);

// Corrected GET and POST routes for reviews
router.get("/:id/reviews", getProductReviews); // New: Get all reviews for a product
router.post("/:id/reviews", protectedRoute, createReview); // Correct: Use POST for creating a review

router.get("/:id", protectedRoute, getProductById); // No need for protectedRoute for a public product page
router.put("/:id", protectedRoute, updateProducts);
router.delete("/:id", protectedRoute, deleteProducts);

export default router;
