import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Grid,
  Link as ChakraLink,
  Flex,
  Avatar,
  HStack,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { authStore } from "../store/authStore";
import ProductCard from "../components/ProductCard";
import { PlusCircle } from "lucide-react";

const DashboardPage = () => {
  const { products, fetchProducts, loading } = useProductStore();
  const { authUser } = authStore();
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const headingColor = useColorModeValue("gray.700", "gray.100");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!authUser) {
    return (
      <Box maxW={"container.xl"} py={12} textAlign="center">
        <Heading>Unauthorized</Heading>
        <Text mt={4}>Please log in to view the dashboard.</Text>
      </Box>
    );
  }

  const userProducts = products.filter(
    (product) => product.ownerId === authUser._id
  );

  return (
    <Box maxW={"container.xl"} py={12} px={4}>
      <VStack spacing={8} align="stretch">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          p={6}
          bg={cardBg}
          rounded="lg"
          boxShadow="md"
        >
          <HStack spacing={4}>
            <Avatar
              size="lg"
              name={authUser.fullName}
              src={authUser.profilePic}
            />
            <Box>
              <Heading size="md" color={headingColor}>
                {authUser.fullName}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Welcome to your dashboard
              </Text>
            </Box>
          </HStack>
          <ChakraLink as={ReactRouterLink} to="/create-product">
            <Button
              colorScheme="teal"
              leftIcon={<PlusCircle />}
              isLoading={loading}
            >
              Add New Product
            </Button>
          </ChakraLink>
        </Flex>

        <Divider />

        <Heading size="md" pt={4} color={headingColor}>
          Your Analytics
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <Stat
            p={5}
            shadow="md"
            border="1px"
            borderColor={useColorModeValue("gray.200", "gray.600")}
            rounded="lg"
          >
            <StatLabel>Products Listed</StatLabel>
            <StatNumber>{userProducts.length}</StatNumber>
          </Stat>
          <Stat
            p={5}
            shadow="md"
            border="1px"
            borderColor={useColorModeValue("gray.200", "gray.600")}
            rounded="lg"
          >
            <StatLabel>Total Products</StatLabel>
            <StatNumber>{products.length}</StatNumber>
          </Stat>
        </Grid>

        <Divider />

        <Flex justify="space-between" align="center">
          <Heading size="md" pt={4} color={headingColor}>
            Your Products
          </Heading>
          <ChakraLink as={ReactRouterLink} to="/">
            <Text fontSize="sm" color="blue.500">
              View All Products
            </Text>
          </ChakraLink>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" />
          </Flex>
        ) : userProducts.length === 0 ? (
          <Box
            p={8}
            textAlign="center"
            border="1px dashed"
            borderColor="gray.300"
            rounded="md"
          >
            <Text fontSize="lg" color="gray.500">
              You have not added any products yet.
            </Text>
            <ChakraLink as={ReactRouterLink} to="/create-product" mt={4}>
              <Button colorScheme="teal" leftIcon={<PlusCircle />}>
                Add Your First Product
              </Button>
            </ChakraLink>
          </Box>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
            {userProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </Grid>
        )}
      </VStack>
    </Box>
  );
};

export default DashboardPage;
