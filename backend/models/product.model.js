import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "https://example.com/default-product-image.png", // Consider a proper default image URL
    },
    imagePublicId: {
      // This is the new field for Cloudinary management
      type: String,
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v) => Math.round(v * 10) / 10, // Round to one decimal place
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update the rating and numReviews on the product
productSchema.statics.updateProductRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(productId) } },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "product",
        as: "productReviews",
      },
    },
    { $unwind: "$productReviews" },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$productReviews.rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    const { averageRating, numOfReviews } = stats[0] || {
      averageRating: 0,
      numOfReviews: 0,
    };

    await this.findByIdAndUpdate(productId, {
      rating: averageRating,
      numReviews: numOfReviews,
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
};

const Product = mongoose.model("Product", productSchema);

export default Product;
