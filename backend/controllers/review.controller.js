// src/controllers/review.controller.js

import Review from "../models/review.model.js";
import Product from "../models/product.model.js"; // Make sure to import Product
import AppError from "../utils/appError.js";

// @route POST /api/products/:id/reviews
// @desc Create a new review for a product
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;
    const userId = req.user._id;

    if (!rating || !comment) {
      return next(
        new AppError("Please provide both a rating and a comment.", 400)
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError("Product not found.", 404));
    }

    const alreadyReviewed = await Review.findOne({
      productId: id,
      user: userId,
    });
    if (alreadyReviewed) {
      return next(new AppError("You have already reviewed this product.", 400));
    }

    // Create the new review
    const review = await Review.create({
      product: id,
      user: userId,
      rating,
      comment,
    });

    // ✅ FIX: Use the efficient static method to update the product's rating.
    await Product.updateProductRating(id);

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return next(new AppError("Internal Server Error", 500));
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reviews = await Review.find({ productId: id })
      .populate("user", "fullName profileImg")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getProductReviews controller", error);
    return next(new AppError("Internal server error", 500));
  }
};
