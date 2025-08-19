// src/pages/HomePage.jsx

import {
  Container,
  Box,
  VStack,
  Text,
  SimpleGrid,
  Input,
  Button,
  HStack,
  Spinner,
  Flex,
  Heading,
  Center,
  useColorModeValue,
  Select, // Make sure you import Select
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link as ReactRouterLink } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { Plus } from "lucide-react";

// Number of products to display per page
const PRODUCTS_PER_PAGE = 6;

const HomePage = () => {
  const [searchItem, setSearchItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products based on search term and category
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchItem.toLowerCase()) &&
      (category === "" || product.category === category)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchItem(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };
  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh" w="100vw">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Container maxW={"container.xl"} py={10}>
      <VStack spacing={6}>
        <Heading
          as="h1"
          fontSize={["2xl", "3xl", "4xl"]}
          fontWeight={"extrabold"}
          bgGradient={"linear(to-r, blue.400, pink.500)"}
          bgClip={"text"}
        >
          All Available Products 🚀
        </Heading>

        <HStack spacing={4} maxW={"500px"} w="full">
          <Input
            placeholder="Search products..."
            value={searchItem}
            onChange={handleSearchChange}
            size="lg"
            variant="filled"
          />
          <Select
            placeholder="Category"
            value={category}
            onChange={handleCategoryChange}
            size="lg"
            variant="filled"
          >
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </Select>
        </HStack>

        {filteredProducts.length === 0 ? (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            mt={10}
            textAlign="center"
            p={6}
            border="2px dashed"
            borderColor={useColorModeValue("gray.300", "gray.600")}
            rounded="lg"
          >
            <Heading size="md" color="gray.500">
              No products found for "{searchItem}" 😢
            </Heading>
            <Text mt={4} color="gray.500">
              Try searching for something else or be the first to{" "}
              <ReactRouterLink to={"/create-product"}>
                <Text
                  as="span"
                  color="blue.500"
                  textDecoration="underline"
                  fontWeight="bold"
                >
                  create a new product!
                </Text>
              </ReactRouterLink>
            </Text>
          </Flex>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={10}
            w={"full"}
          >
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </SimpleGrid>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <HStack spacing={4} justify="center" pt={6}>
            <Button
              onClick={handlePrev}
              isDisabled={currentPage === 1}
              colorScheme="teal"
              variant="outline"
            >
              Prev
            </Button>
            <Text>
              Page **{currentPage}** of **{totalPages}**
            </Text>
            <Button
              onClick={handleNext}
              isDisabled={currentPage === totalPages}
              colorScheme="teal"
              variant="outline"
            >
              Next
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;