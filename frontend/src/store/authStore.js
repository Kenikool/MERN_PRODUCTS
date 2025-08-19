import { create } from "zustand";
import axiosInstance from "../api/axios";
import { toast } from "react-hot-toast";
import { useProductStore } from "./useProductStore";
export const authStore = create((set) => ({
  loading: false,
  authUser: null,
  error: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.log("error in checkAuth: ", error.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  register: async (formData) => {
    set({ loading: true, error: false });

    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data, loading: false });
      toast.success("Registration sucessfully");
    } catch (err) {
      set({ loading: false, error: true });
      toast.error(err.response?.data?.message || "soemthing wnet wrong");
    }
  },
  login: async (formData) => {
    set({ loading: true, error: false });

    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    set({ loading: true, error: false });

    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
  updateProfile: async (updatedFields) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.put("/auth/profile", updatedFields);
      const updatedUser = res.data;
      set({ authUser: updatedUser });
      toast.success("Profile updated successfully!");
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  deleteAccount: async () => {
    set({ loading: true });
    try {
      await axiosInstance.delete("/auth/profile");
      set({ authUser: null });
      // Also clear all products from the product store
      const { setProducts } = useProductStore.getState();
      setProducts([]);
      toast.success("Account deleted successfully!");
      // Optionally, redirect the user to the login page
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete account.";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      set({ loading: false });
    }
  },
}));
