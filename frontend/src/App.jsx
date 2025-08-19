import { Box, Spinner, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "react-hot-toast";
import { authStore } from "./store/authStore";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CreateProductPage from "./pages/CreateProductPage";
import ProfilePage from "./pages/ProfilePage";
import NoMatchPage from "./components/NoMatchPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = authStore();
  // const [loading, setLoading] = useState(true); // <-- Initialize local loading state

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      // setLoading(false); // <-- Set loading to false after checkAuth completes
    };
    initializeAuth();
  }, [checkAuth]);

  // If the page is still loading, show a spinner and do not render routes
  if (isCheckingAuth) {
    return (
      <Flex
        minH={"100vh"}
        w={"100vw"}
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Box minH={"100vh"} w={"100vw"}>
      <Navbar authUser={authUser} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Auth-Specific Routes: Redirect authenticated users away from signup/login */}
        <Route
          path="/signup"
          element={!authUser ? <RegisterPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />

        {/* Protected Routes: Only for authenticated users */}
        <Route
          path="/dashboard"
          element={authUser ? <DashboardPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/create-product"
          element={
            authUser ? <CreateProductPage /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/products/:id"
          element={
            authUser ? <ProductDetailsPage /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />

        {/* Fallback Route for non-matching URLs */}
        <Route path="*" element={<NoMatchPage />} />
      </Routes>
      <Toaster />
    </Box>
  );
};

export default App;
