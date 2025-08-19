import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  InputGroup,
  InputLeftElement,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Mail, Lock } from "lucide-react";
import { authStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom"; // Import useNavigate and Link

const Login = () => {
  const { login, loading, error } = authStore();
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      toast.success("Login successful!");
      navigate("/dashboard"); // Redirect to the dashboard on success
    }
  };

  return (
    <Box
      p={8}
      maxW="md"
      mx="auto"
      boxShadow={"lg"}
      border={"1px solid gray"}
      rounded={"md"}
      mt={"20"}
    >
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading as="h2" size="xl">
          Log In
        </Heading>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Mail size={18} />
            </InputLeftElement>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </InputGroup>
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Lock size={18} />
            </InputLeftElement>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </InputGroup>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
          isLoading={loading}
          loadingText="Logging in..."
        >
          Log In
        </Button>
        <Text>
          Don't have an account?{" "}
          <ChakraLink as={ReactRouterLink} to="/signup" color={"blue.500"}>
            Register
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
