// src/store/useProductStore.jsx

import { create } from "zustand";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";
import { authStore } from "./authStore";

export const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  reviews: [], // Added state for reviews
  loading: false,
  error: null, // Added state for error handling
  stats: {
    totalProducts: 0,
    totalUsers: 0,
    productsByOwner: [],
  },

  setProducts: (products) => set({ products }),

  createProduct: async (newProducts) => {
    set({ loading: true, error: null });
    if (!newProducts.name || !newProducts.price || !newProducts.image) {
      toast.error("All fields are required");
      set({ loading: false });
      return;
    }
    try {
      const res = await axiosInstance.post("/products", newProducts);
      set((state) => ({ products: [...state.products, res.data.data] }));
      toast.success("Product created successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/products");
      set({ products: res.data.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch products.";
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  // Optimized to fetch reviews and product in a single action
  // getProductById: async (id) => {
  //   set({ loading: true, selectedProduct: null, error: null, reviews: [] });
  //   try {
  //     const productRes = await axiosInstance.get(`/products/${id}`);
  //     const product = productRes.data?.data;

  //     // Fetch reviews and handle potential non-array responses
  //     const reviewsRes = await axiosInstance.get(`/products/${id}/reviews`);
  //     const fetchedReviews = Array.isArray(reviewsRes.data)
  //       ? reviewsRes.data
  //       : [];

  //     set({
  //       selectedProduct: product,
  //       reviews: fetchedReviews,
  //       loading: false,
  //     });
  //     return { success: true, data: product };
  //   } catch (error) {
  //     const errorMessage =
  //       error.response?.data.message || "Failed to fetch product details.";
  //     toast.error(errorMessage);
  //     set({ loading: false, error: errorMessage });
  //     return { success: false, data: null };
  //   }
  // },

  getProductById: async (id) => {
    set({ loading: true, selectedProduct: null, error: null, reviews: [] });
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      const product = res.data?.data;

      set({
        selectedProduct: product,
        reviews: Array.isArray(product?.reviews) ? product.reviews : [],
        loading: false,
      });

      return { success: true, data: product };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch product details.";
      toast.error(errorMessage);
      set({ loading: false, error: errorMessage });
      return { success: false, data: null };
    }
  },

  // Action to add a new review
  addReview: async (id, reviewData) => {
    try {
      const res = await axiosInstance.post(
        `/products/${id}/reviews`,
        reviewData,
        {
          withCredentials: true,
        }
      );
      // Add the new review to the beginning of the reviews array
      set((state) => ({ reviews: [res.data, ...state.reviews] }));
      toast.success("Review submitted successfully!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data.message || "Failed to submit review.";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },

  deleteProduct: async (pid) => {
    set({ loading: true, error: null });
    const { authUser } = authStore.getState();
    const productToDelete = get().products.find((p) => p._id === pid);

    if (authUser?._id !== productToDelete?.ownerId) {
      set({ loading: false });
      return {
        success: false,
        message: "You are not authorized to delete this product.",
      };
    }
    try {
      await axiosInstance.delete(`/products/${pid}`);
      set((state) => ({
        products: state.products.filter((p) => p._id !== pid),
      }));
      return { success: true, message: "Product deleted successfully!" };
    } catch (error) {
      console.error("Failed to delete product:", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      set({ error: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    set({ loading: true, error: null });
    const { authUser } = authStore.getState();
    const productToUpdate = get().products.find((p) => p._id === pid);

    if (authUser?._id !== productToUpdate?.ownerId) {
      set({ loading: false });
      return {
        success: false,
        message: "You are not authorized to update this product.",
      };
    }
    try {
      const res = await axiosInstance.put(`/products/${pid}`, updatedProduct);
      set((state) => ({
        products: state.products.map((p) =>
          p._id === pid ? res.data.data : p
        ),
      }));
      return { success: true, message: "Product updated successfully!" };
    } catch (error) {
      console.error("Failed to update product:", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      set({ error: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  fetchDashboardStats: async () => {
    set({ error: null });
    try {
      const res = await axiosInstance.get("/dashboard/stats");
      set({ stats: res.data.data });
    } catch (error) {
      console.error("Error fetching stats:", error);
      const errorMessage = "Failed to fetch dashboard stats.";
      toast.error(errorMessage);
      set({ error: errorMessage });
    }
  },
}));
