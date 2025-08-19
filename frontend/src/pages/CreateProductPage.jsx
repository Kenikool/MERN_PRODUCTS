import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  useColorModeValue,
  FormLabel,
  FormControl,
  Image,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useProductStore } from "../store/useProductStore";
import { useState, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CreateProductPage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null, // Change to null to better represent no file selected
  });
  const [imagePreview, setImagePreview] = useState(null);

  const { createProduct, loading } = useProductStore();
  const fileInputRef = useRef(null); // Create a reference to the file input
  const toast = useToast(); // Use Chakra UI's toast for better integration
  const navigate = useNavigate(); // Initialize the navigate function

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
        setImagePreview(reader.result); // Set the preview image
        toast({
          title: "Image Selected.",
          description: "Product image is ready to be uploaded.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.description ||
      !newProduct.image
    ) {
      toast({
        title: "Error.",
        description: "Please fill out all fields and upload an image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const success = await createProduct(newProduct);
    if (success) {
      toast({
        title: "Product Created.",
        description: "Your product has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard"); // Redirect on success
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8} mt={8} as="form" onSubmit={handleSubmit}>
        <Heading
          as={"h1"}
          bgGradient={"linear(to-r, cyan.500, pink.400)"}
          bgClip={"text"}
          size={"2xl"}
          textAlign={"center"}
          mb={8}
        >
          Create Product
        </Heading>

        <Box
          bg={useColorModeValue("white", "gray.800")}
          w={"full"}
          p={8}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                placeholder="Product Name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Product Price ($)</FormLabel>
              <Input
                placeholder="Product Price"
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Product Description</FormLabel>
              <Textarea
                placeholder="Product Description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                rows={4}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Product Image</FormLabel>
              <VStack
                spacing={2}
                align="center"
                border="2px dashed"
                borderColor={useColorModeValue("gray.300", "gray.600")}
                p={6}
                rounded="md"
                cursor="pointer"
                onClick={handleIconClick}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    boxSize="150px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                ) : (
                  <VStack spacing={2} color="gray.500">
                    <ImageIcon size={48} />
                    <Text fontSize="sm">Click to upload image</Text>
                  </VStack>
                )}
                <Input
                  id="image-upload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  display="none"
                />
              </VStack>
            </FormControl>

            <Button
              colorScheme="teal"
              type="submit"
              isLoading={loading}
              w={"full"}
            >
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreateProductPage;
