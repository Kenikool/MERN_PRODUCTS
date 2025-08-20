import Product from "../models/product.model.js";
import AppError from "../utils/appError.js";
import cloudinary from "../libs/cloudinary.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error in getAllProducts controller", error);
    return next(new AppError("Internal server error", 500));
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError(`No product found with id: ${id}`, 404));
    }
    res.status(200).json({ data: product });
  } catch (error) {
    console.error("Error in get product by id controller", error);
    return next(new AppError("Internal server error", 500));
  }
};

export const createProduct = async (req, res, next) => {
  const { name, price, description, image } = req.body;
  const ownerId = req.user._id;

  try {
    if (!name || !price || !description || !image) {
      return next(new AppError("All fields are required", 400));
    }
    if (isNaN(price) || price < 0) {
      return next(new AppError("Price must be a positive number", 400));
    }

    let imageUrl = "";
    let imagePublicId = null;

    if (image) {
      try {
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: "ecommerce-products", // Consistent folder name
        });
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id; // Store the public_id
      } catch (uploadError) {
        console.error("Cloudinary image upload failed:", uploadError);
        return next(new AppError("Failed to upload image", 500));
      }
    }

    const product = await Product.create({
      name,
      price,
      description,
      image: imageUrl,
      imagePublicId, // Save the public_id
      ownerId,
    });

    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const updateProducts = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { name, price, description, image } = req.body;

  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return next(new AppError("Product not found", 404));
    }

    // Authorization check: Is the user the owner? (Moved to top)
    if (existingProduct.ownerId.toString() !== userId.toString()) {
      return next(
        new AppError("You are not authorized to update this product", 403)
      );
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        return next(new AppError("Price must be a positive number", 400));
      }
      updateFields.price = price;
    }

    if (image) {
      try {
        // Delete old image only if it's not a default image and exists
        if (existingProduct.imagePublicId) {
          await cloudinary.uploader.destroy(existingProduct.imagePublicId);
        }

        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: "ecommerce-products",
        });
        updateFields.image = uploadResult.secure_url;
        updateFields.imagePublicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error("Cloudinary image update failed:", uploadError);
        return next(new AppError("Failed to update product image", 500));
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const deleteProducts = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const productToDelete = await Product.findById(id);

    if (!productToDelete) {
      return next(new AppError("Product with this id not found", 404));
    }

    // Authorization check first and foremost
    if (productToDelete.ownerId.toString() !== userId.toString()) {
      return next(
        new AppError("You are not authorized to delete this product", 403)
      );
    }

    // Now handle Cloudinary deletion
    if (productToDelete.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(productToDelete.imagePublicId);
        console.log(
          `Successfully deleted Cloudinary image: ${productToDelete.imagePublicId}`
        );
      } catch (cloudinaryError) {
        console.error(
          `Error deleting Cloudinary image for product ${id}:`,
          cloudinaryError
        );
        // We can continue to delete the product from the DB even if image deletion fails.
      }
    } else {
      console.log(`No Cloudinary public_id found for product ${id}.`);
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: deletedProduct,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Internal server error", 500));
  }
};
