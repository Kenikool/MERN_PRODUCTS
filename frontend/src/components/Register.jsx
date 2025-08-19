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
import { User, Mail, Lock } from "lucide-react";
import { authStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom"; // Import useNavigate and Link

const Register = () => {
  const { register, loading, error } = authStore();
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.confirmPassword !== formData.password) {
      toast.error("Passwords do not match");
      return;
    }
    const success = await register(formData);
    if (success) {
      toast.success("Registration successful! Please log in.");
      navigate("/login"); // Redirect to the login page on success
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
      mt={"4"}
    >
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading as="h2" size="xl">
          Create an Account
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
              <User size={18} />
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
        <FormControl id="fullName" isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Mail size={18} />
            </InputLeftElement>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
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
              placeholder="Create a password"
            />
          </InputGroup>
        </FormControl>
        <FormControl id="confirmPassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Lock size={18} />
            </InputLeftElement>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </InputGroup>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
          isLoading={loading}
          loadingText="Submitting"
        >
          Register
        </Button>
        <Text>
          Already have an account?{" "}
          <ChakraLink as={ReactRouterLink} to="/login" color={"blue.500"}>
            Login
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register;
