import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const productsByOwner = await Product.aggregate([
      {
        $group: {
          _id: "$ownerId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
      {
        $project: {
          _id: 0,
          ownerName: "$owner.fullName",
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalUsers,
        productsByOwner,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return next(new AppError("Failed to fetch dashboard stats", 500));
  }
};
