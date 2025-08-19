import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../libs/cloudinary.js";
import Product from "../models/product.model.js";

export const signup = async (req, res, next) => {
  const { username, fullName, email, password, confirmPassword } = req.body;

  try {
    if (!username || !fullName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }
    if (password !== confirmPassword) {
      return next(new AppError("Passwords do not match", 400));
    }
    if (password.length < 6) {
      return next(
        new AppError("Password must be at least 6 characters long", 400)
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Please provide a valid email address", 400));
    }

    const user = await User.findOne({ email });
    if (user) {
      return next(new AppError("User already exists", 409));
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      fullName: fullName,
      email: email,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      const { password, ...userData } = newUser.toObject(); // Exclude password from the response

      return res.status(201).json(userData);
    } else {
      return next(new AppError("Invalid user data", 500));
    }
  } catch (error) {
    console.error("Error in signup controller", error);
    return next(new AppError("Internal server error", 500));
  }
};

// export const login = async (req, res, next) => {
//   const { username, password } = req.body;
//   try {
//     if (!username || !password) {
//       return next(new AppError("All fields are required", 400));
//     }

//     // 1. Await the findOne query and select the password field
//     const user = await User.findOne({ username }).select("+password");

//     // 2. Check if the user exists
//     if (!user) {
//       return next(new AppError("Invalid credentials", 400));
//     }

//     // 3. Await the bcrypt.compare function.
//     // The second argument must be the password string from the user object.
//     const isMatchPassword = await bcrypt.compare(password, user.password);

//     // Check if the passwords match
//     if (!isMatchPassword) {
//       return next(new AppError("Invalid credentials", 400));
//     }

//     // Generate JWT (assuming this function is defined elsewhere)
//     generateToken(user._id, res);

//     // After a successful login, you should return the user object without the password
//     const userWithoutPassword = await User.findById(user._id); // Re-fetch the user to exclude the password

//     res.status(200).json({
//       _id: userWithoutPassword._id,
//       fullName: userWithoutPassword.fullName,
//       username: userWithoutPassword.username,
//       email: userWithoutPassword.email,
//       profilePic: userWithoutPassword.profilePic,
//     });
//   } catch (error) {
//     console.error("Error in login controller", error);
//     // Correctly pass the error and status code to the next middleware
//     return next(new AppError("Internal server error", 500));
//   }
// };

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return next(new AppError("All fields are required", 400));
    }
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return next(new AppError("Invalid credentials", 400));
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return next(new AppError("Invalid credentials", 400));
    }
    generateToken(user._id, res);

    const { password: userPassword, ...userData } = user.toObject();

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error in login controller", error);
    return next(new AppError("Internal server error", 500));
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Error in logout controller", error);
    return next(new AppError("Internal server error", 500));
  }
};

// export const updateProfile = async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     const updates = req.body;
//     if (Object.keys(updates).length === 0) {
//       return next(new AppError("No fields to update provided.", 400));
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       return next(new AppError("User not found.", 404));
//     }
//     const updatedFields = {};

//     for (const key in updates) {
//       if (
//         ["username", "fullName", "email", "profilePic", "password"].includes(
//           key
//         )
//       ) {
//         if (key === "profilePic") {
//           // You should use the same folder name as during the upload
//           const folderName = "your-cloudinary-folder"; // e.g., "ecommerce-users"
//           if (user.profilePic && !user.profilePic.includes("/avatar.png")) {
//             try {
//               const publicId = user.profilePic
//                 .split(`/${folderName}/`)
//                 .pop()
//                 .split(".")[0];
//               if (publicId) {
//                 await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
//               }
//             } catch (destroyError) {
//               console.error("Error destroying old profile pic:", destroyError);
//             }
//           }
//           const uploadResponse = await cloudinary.uploader.upload(
//             updates.profilePic,
//             {
//               folder: folderName, // Ensure this folder matches
//             }
//           );
//           updatedFields.profilePic = uploadResponse.secure_url;
//         } else if (key === "password") {
//           if (updates.password.length < 6) {
//             return next(
//               new AppError("Password must be at least 6 characters long", 400)
//             );
//           }
//           const salt = await bcrypt.genSalt(10);
//           const hashedPassword = await bcrypt.hash(updates.password, salt);
//           updatedFields.password = hashedPassword;
//         } else {
//           updatedFields[key] = updates[key];
//         }
//       }
//     }
//     if (Object.keys(updatedFields).length === 0) {
//       return next(new AppError("Invalid provided fields for update", 400)); // Changed status to 400
//     }
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updatedFields },
//       { new: true, runValidators: true }
//     ).select("-password"); // Select the fields you need, and exclude password
//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("Error in updateProfile controller:", error);
//     return next(new AppError("Internal Server Error", 500));
//   }
// };

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return next(new AppError("No fields to update provided.", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    const updatedFields = {};

    for (const key in updates) {
      if (
        ["username", "fullName", "email", "profilePic", "password"].includes(
          key
        )
      ) {
        if (key === "profilePic") {
          // Check if the profilePic value is a new Base64 image string, not the old URL
          if (
            updates.profilePic &&
            updates.profilePic.startsWith("data:image")
          ) {
            const folderName = "your-cloudinary-folder";

            // Delete old image if it's not the default avatar
            if (
              user.profilePic &&
              !user.profilePic.includes("default-avatar.png")
            ) {
              try {
                const publicId = user.profilePic.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
              } catch (destroyError) {
                console.error(
                  "Error destroying old profile pic:",
                  destroyError
                );
              }
            }

            // Upload the new image
            const uploadResponse = await cloudinary.uploader.upload(
              updates.profilePic,
              {
                folder: folderName,
              }
            );
            updatedFields.profilePic = uploadResponse.secure_url;
          }
          // If it's a profilePic key but not a new image, do nothing.
        } else if (key === "password") {
          if (updates.password.length < 6) {
            return next(
              new AppError("Password must be at least 6 characters long", 400)
            );
          }
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(updates.password, salt);
          updatedFields.password = hashedPassword;
        } else {
          updatedFields[key] = updates[key];
        }
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return next(
        new AppError(
          "Invalid provided fields for update or no changes made",
          400
        )
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    return next(new AppError("Internal Server Error", 500));
  }
};
export const deleteAccount = async (req, res, next) => {
  try {
    // Get the user ID from the authenticated request
    const userId = req.user._id;

    const productsToDelete = await Product.find({ ownerId: userId });
    for (const product of productsToDelete) {
      if (product.image && !product.image.includes("/avatar.png")) {
        try {
          // Extract the public_id and delete the image from Cloudinary
          const urlParts = product.image.split("/");
          const folderIndex = urlParts.indexOf("products");
          let publicId = null;
          if (folderIndex !== -1 && urlParts.length > folderIndex + 1) {
            publicId = urlParts.slice(folderIndex).join("/").split(".")[0];
          }
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (cloudinaryError) {
          console.error(
            `Error deleting Cloudinary image for product ${product._id}:`,
            cloudinaryError
          );
        }
      }
    }

    // 2. Delete all products owned by the user from the database
    await Product.deleteMany({ ownerId: userId });

    // Find and delete the user by their ID
    const deletedUser = await User.findByIdAndDelete(userId);

    // If no user was found, return a 404 error
    if (!deletedUser) {
      return next(new AppError("User not found", 400));
    }

    // 4. Clear the authentication cookie
    res.cookie("token", "", { maxAge: 0 });
    // Send a success message
    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error in deleteAccount controller:", error);

    return next(new AppError("Internal Server Error", 500));
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const { password, ...userData } = user.toObject();
    return res.status(200).json(userData);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    return next(new AppError("Internal Server Error", 500));
  }
};
