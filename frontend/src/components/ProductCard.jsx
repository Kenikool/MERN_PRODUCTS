import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormLabel,
  FormControl,
  Flex,
  Spacer,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import { useProductStore } from "../store/useProductStore";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef as useReactRef } from "react";
import { ImageIcon, Trash2, Edit } from "lucide-react"; // Using lucid-react for clean, modern icons
import { authStore } from "../store/authStore";

const MotionBox = motion.create(Box);

const ProductCard = ({ product }) => {
  const textColor = useColorModeValue("gray.800", "gray.100");
  const cardBg = useColorModeValue("white", "gray.700");
  const toast = useToast();

  // State and hooks for modals
  const { isOpen, onOpen, onClose } = useDisclosure(); // Edit Modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure(); // Delete Dialog

  const cancelRef = useRef();

  // Zustand store actions
  const { deleteProduct, updateProduct, loading } = useProductStore();
  const { authUser } = authStore();
  const isOwner = authUser?._id === product.ownerId;

  const [updatedProduct, setUpdatedProduct] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Set initial state when the edit modal opens
  useEffect(() => {
    if (isOpen) {
      setUpdatedProduct(product);
      setImagePreview(product.image || null);
    }
  }, [isOpen, product]);

  const handleDelete = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
  };

  const handleUpdateProduct = async () => {
    if (!updatedProduct.name || !updatedProduct.price) {
      toast({
        title: "Error",
        description: "Name and Price are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const { success, message } = await updateProduct(
      product._id,
      updatedProduct
    );
    toast({
      title: success ? "Updated" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
    if (success) {
      onClose();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedProduct({ ...updatedProduct, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const ref = useReactRef();
  const inView = useInView(ref, { once: true });

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      shadow="md"
      rounded="lg"
      overflow="hidden"
      bg={cardBg}
      _hover={{ shadow: "xl", transform: "scale(1.02)" }}
      position="relative" // for absolute positioning of buttons
    >
      <Link to={`/products/${product._id}`}>
        <Box>
          <Image
            src={product.image || "/fallback.jpg"}
            alt={product.name}
            w="full"
            h="200px"
            objectFit="cover"
          />
          <Box p={4}>
            <Heading size="md" fontWeight="bold" mb={1} color={textColor}>
              {product.name}
            </Heading>
            <Text color="cyan.400" fontSize="lg" fontWeight="semibold">
              ${product.price}
            </Text>
          </Box>
        </Box>
      </Link>

      {isOwner && (
        <HStack
          spacing={2}
          position="absolute"
          top={3}
          right={3}
          bg="rgba(255,255,255,0.8)"
          p={1}
          rounded="md"
        >
          <IconButton
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onOpen();
            }}
            icon={<Edit size={16} />}
            colorScheme="blue"
            aria-label="Edit product"
          />
          <IconButton
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onDeleteOpen();
            }}
            icon={<Trash2 size={16} />}
            colorScheme="red"
            aria-label="Delete product"
          />
        </HStack>
      )}

      {/* ✏️ Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {/* Image Upload Section */}
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Product Image</FormLabel>
                  <VStack
                    spacing={2}
                    p={4}
                    border="2px dashed"
                    borderColor="gray.300"
                    rounded="md"
                    w="full"
                    h="100%"
                    justify="center"
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        boxSize="200px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    ) : (
                      <VStack spacing={2} color="gray.500">
                        <ImageIcon size={48} />
                        <Text>Click to upload image</Text>
                      </VStack>
                    )}
                    <Input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      display="none"
                    />
                    <Button
                      colorScheme="blue"
                      onClick={() => fileInputRef.current.click()}
                      leftIcon={<ImageIcon />}
                    >
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Button>
                  </VStack>
                </FormControl>
              </VStack>

              {/* Form Fields Section */}
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Product name</FormLabel>
                  <Input
                    placeholder="Product name"
                    value={updatedProduct.name || ""}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <Input
                    placeholder="Price"
                    type="number"
                    value={updatedProduct.price || ""}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Description"
                    value={updatedProduct.description || ""}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </VStack>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUpdateProduct}
              isLoading={loading}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 🗑️ Delete Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete <strong>{product.name}</strong>?
              This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDelete(product._id)}
                ml={3}
                isLoading={loading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </MotionBox>
  );
};

export default ProductCard;
