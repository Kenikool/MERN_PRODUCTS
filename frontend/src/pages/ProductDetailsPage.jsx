// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Heading,
//   Text,
//   Stack,
//   Image,
//   Button,
//   useColorModeValue,
//   Badge,
//   HStack,
//   Flex,
//   Textarea,
//   FormControl,
//   FormLabel,
//   useToast,
//   Container,
//   VStack,
//   Spinner,
//   Divider,
// } from "@chakra-ui/react";
// import { authStore } from "../store/authStore";
// import { StarIcon } from "@chakra-ui/icons";
// import { useProductStore } from "../store/useProductStore";

// const ProductDetailsPage = () => {
//   // 1. All hooks are called at the top level, unconditionally.
//   const { id } = useParams();
//   const { authUser } = authStore();
//   const toast = useToast();
//   const [reviewLoading, setReviewLoading] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const {
//     selectedProduct,
//     reviews,
//     loading,
//     error,
//     getProductById,
//     addReview,
//   } = useProductStore();

//   useEffect(() => {
//     getProductById(id);
//   }, [id, getProductById]);

//   // 2. Handle loading and error states with conditional returns inside the render logic.
//   if (loading) {
//     return (
//       <Flex justifyContent="center" alignItems="center" minH="100vh">
//         <Spinner size="xl" color="blue.500" />
//       </Flex>
//     );
//   }

//   if (error) {
//     return (
//       <Flex justifyContent="center" alignItems="center" minH="100vh">
//         <Heading color="red.500">Error: {error}</Heading>
//       </Flex>
//     );
//   }

//   // Handle the case where no product is found after loading
//   if (!selectedProduct) {
//     return (
//       <Flex justifyContent="center" alignItems="center" minH="100vh">
//         <Heading>Product Not Found</Heading>
//       </Flex>
//     );
//   }

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!authUser) {
//       toast({
//         title: "Not logged in.",
//         description: "Please log in to leave a review.",
//         status: "info",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }
//     if (rating === 0 || comment.trim() === "") {
//       toast({
//         title: "Invalid review.",
//         description: "Please provide a rating and a comment.",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     setReviewLoading(true);

//     const result = await addReview(id, { rating, comment });
//     if (result.success) {
//       await getProductById(id);
//       setRating(0);
//       setComment("");
//       toast({
//         title: "Review Submitted.",
//         description: "Your review has been successfully submitted.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } else {
//       // ✅ Add an else block to handle the failed case
//       toast({
//         title: "Submission failed.",
//         description: result.message || "Failed to submit review.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }

//     setReviewLoading(false);
//   };

//   return (
//     <Container maxW={"container.xl"} py={10}>
//       <Stack spacing={8}>
//         {/* Product Details Section */}
//         <Box
//           p={6}
//           rounded="lg"
//           shadow="md"
//           bg={useColorModeValue("white", "gray.800")}
//         >
//           <HStack spacing={4} alignItems="flex-start">
//             <Box boxSize={{ base: "100%", md: "sm" }}>
//               <Image
//                 src={selectedProduct.image}
//                 alt={selectedProduct.name}
//                 objectFit="cover"
//                 rounded="lg"
//               />
//             </Box>
//             <VStack align="flex-start" spacing={4} flex={1}>
//               <Heading as="h1" size="xl">
//                 {selectedProduct.name}
//               </Heading>
//               <Text fontSize="lg" color="gray.500">
//                 {selectedProduct.description}
//               </Text>
//               <Text fontWeight="bold" fontSize="2xl">
//                 ${selectedProduct.price}
//               </Text>
//               {/* <HStack spacing={1}>
//                 {[...Array(5)].map((_, i) => (
//                   <StarIcon
//                     key={i}
//                     cursor="pointer"
//                     // The color changes based on whether the index is less than the current rating
//                     color={i < rating ? "yellow.400" : "gray.300"}
//                     onClick={() => setRating(i + 1)} // Clicking a star updates the rating state
//                   />
//                 ))}
//                 <Text ml={2} fontSize="sm">
//                   ({selectedProduct.numReviews} reviews)
//                 </Text>
//               </HStack> */}

//               <HStack spacing={1}>
//                 {[...Array(5)].map((_, i) => (
//                   <StarIcon
//                     key={i}
//                     color={
//                       i < selectedProduct.rating ? "yellow.400" : "gray.300"
//                     }
//                   />
//                 ))}
//                 <Text ml={2} fontSize="sm">
//                   ({selectedProduct.numReviews} reviews)
//                 </Text>
//               </HStack>
//             </VStack>
//           </HStack>
//         </Box>
//         <Divider />
//         {/* Reviews Section */}
//         <Box
//           p={6}
//           rounded="lg"
//           shadow="md"
//           bg={useColorModeValue("white", "gray.800")}
//         >
//           <Heading as="h2" size="lg" mb={4}>
//             Reviews
//           </Heading>
//           {reviews.length === 0 && (
//             <Text color="gray.500">No reviews yet.</Text>
//           )}
//           <VStack spacing={4} align="stretch">
//             {/* The .map() call is safe because reviews is always an array */}
//             {reviews.map((review) => (
//               <Box
//                 key={review._id}
//                 p={4}
//                 border="1px"
//                 borderColor="gray.200"
//                 rounded="md"
//               >
//                 <HStack spacing={2}>
//                   {[...Array(5)].map((_, i) => (
//                     <StarIcon
//                       key={i}
//                       color={i < review.rating ? "yellow.400" : "gray.300"}
//                     />
//                   ))}
//                   <Text fontWeight="bold">
//                     {review.user?.fullName || "Anonymous"}
//                   </Text>
//                 </HStack>
//                 <Text mt={2}>{review.comment}</Text>
//               </Box>
//             ))}
//           </VStack>
//           {/* Review Form */}
//           {authUser && (
//             <Box mt={6} p={4} border="1px" borderColor="gray.200" rounded="md">
//               <Heading as="h3" size="md" mb={3}>
//                 Leave a Review
//               </Heading>
//               <form onSubmit={handleReviewSubmit}>
//                 <FormControl id="rating" mb={4}>
//                   <FormLabel>Rating</FormLabel>
//                   <HStack spacing={1}>
//                     {[...Array(5)].map((_, i) => (
//                       <StarIcon
//                         key={i}
//                         cursor="pointer"
//                         color={i < rating ? "yellow.400" : "gray.300"}
//                         onClick={() => setRating(i + 1)}
//                       />
//                     ))}
//                   </HStack>
//                 </FormControl>
//                 <FormControl id="comment" mb={4}>
//                   <FormLabel>Comment</FormLabel>
//                   <Textarea
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                   />
//                 </FormControl>
//                 <Button
//                   type="submit"
//                   colorScheme="blue"
//                   isLoading={reviewLoading}
//                 >
//                   Submit Review
//                 </Button>
//               </form>
//             </Box>
//           )}
//         </Box>
//       </Stack>
//     </Container>
//   );
// };

// export default ProductDetailsPage;

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Heading,
//   Text,
//   Stack,
//   Image,
//   Button,
//   useColorModeValue,
//   HStack,
//   Flex,
//   Textarea,
//   FormControl,
//   FormLabel,
//   useToast,
//   Container,
//   VStack,
//   Spinner,
//   Divider,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalBody,
//   IconButton,
//   Alert,
//   AlertIcon,
// } from "@chakra-ui/react";
// import { authStore } from "../store/authStore";
// import { StarIcon } from "@chakra-ui/icons";
// import { useProductStore } from "../store/useProductStore";
// import { AiOutlineZoomIn } from "react-icons/ai";
// import { motion } from "framer-motion";
// import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// import GoBackButton from "../components/GoBackButton";

// const ProductDetailsPage = () => {
//   const { id } = useParams();
//   const { authUser } = authStore();
//   const toast = useToast();
//   const [reviewLoading, setReviewLoading] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const {
//     selectedProduct,
//     reviews,
//     loading,
//     error,
//     getProductById,
//     addReview,
//   } = useProductStore();

//   const { isOpen, onOpen, onClose } = useDisclosure();

//   useEffect(() => {
//     getProductById(id);
//   }, [id, getProductById]);

//   if (loading) {
//     return (
//       <Flex justifyContent="center" alignItems="center" minH="100vh">
//         <Spinner size="xl" color="blue.500" />
//       </Flex>
//     );
//   }

//   if (error) {
//     return (
//       <Flex justifyContent="center" alignItems="center" minH="100vh">
//         <Alert status="error">
//           <AlertIcon />
//           <Heading color="red.500">Error: {error}</Heading>
//         </Alert>
//       </Flex>
//     );
//   }

//   if (!selectedProduct) {
//     return (
//       <Flex justifyContent="center" alignItems="center" minH="100vh">
//         <Heading>Product Not Found</Heading>
//       </Flex>
//     );
//   }

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!authUser) {
//       toast({
//         title: "Not logged in.",
//         description: "Please log in to leave a review.",
//         status: "info",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }
//     if (rating === 0 || comment.trim() === "") {
//       toast({
//         title: "Invalid review.",
//         description: "Please provide a rating and a comment.",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     setReviewLoading(true);

//     const result = await addReview(id, { rating, comment });
//     if (result.success) {
//       await getProductById(id);
//       setRating(0);
//       setComment("");
//       toast({
//         title: "Review Submitted.",
//         description: "Your review has been successfully submitted.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } else {
//       toast({
//         title: "Submission failed.",
//         description: result.message || "Failed to submit review.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }

//     setReviewLoading(false);
//   };

//   const { name, price, description, image } = selectedProduct;

//   return (
//     <Container maxW={"container.xl"} py={10}>
//       <Stack spacing={8}>
//         <GoBackButton productId={id} />
//         {/* Product Details Section */}
//         <Box
//           p={6}
//           rounded="lg"
//           shadow="md"
//           bg={useColorModeValue("white", "gray.800")}
//         >
//           <HStack spacing={4} alignItems="flex-start">
//             <Box position="relative" w={{ base: "100%", md: "sm" }}>
//               <motion.div
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//                 style={{ display: "inline-block", width: "100%" }}
//               >
//                 <Image
//                   src={image}
//                   alt={name}
//                   borderRadius="lg"
//                   objectFit="cover"
//                   maxH="400px"
//                   cursor="zoom-in"
//                   onClick={onOpen}
//                   tabIndex={0}
//                   aria-label={`Zoom image of ${name}`}
//                   _hover={{ boxShadow: "xl" }}
//                   transition="all 0.2s"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === " ") onOpen();
//                   }}
//                   role="button"
//                 />
//               </motion.div>
//               <IconButton
//                 icon={<AiOutlineZoomIn />}
//                 aria-label="Zoom image"
//                 position="absolute"
//                 bottom={2}
//                 right={2}
//                 size="sm"
//                 onClick={onOpen}
//                 bg="whiteAlpha.800"
//                 _hover={{ bg: "whiteAlpha.900" }}
//                 zIndex={2}
//                 tabIndex={-1}
//               />
//             </Box>
//             <VStack align="flex-start" spacing={4} flex={1}>
//               <Heading as="h1" size="xl">
//                 {name}
//               </Heading>
//               <Text fontSize="lg" color="gray.500">
//                 {description}
//               </Text>
//               <Text fontWeight="bold" fontSize="2xl">
//                 ${price}
//               </Text>
//               <HStack spacing={1}>
//                 {[...Array(5)].map((_, i) => (
//                   <StarIcon
//                     key={i}
//                     color={
//                       i < selectedProduct.rating ? "yellow.400" : "gray.300"
//                     }
//                   />
//                 ))}
//                 <Text ml={2} fontSize="sm">
//                   ({selectedProduct.numReviews} reviews)
//                 </Text>
//               </HStack>
//             </VStack>
//           </HStack>
//         </Box>
//         <Divider />
//         {/* Reviews Section */}
//         <Box
//           p={6}
//           rounded="lg"
//           shadow="md"
//           bg={useColorModeValue("white", "gray.800")}
//         >
//           <Heading as="h2" size="lg" mb={4}>
//             Reviews
//           </Heading>
//           {reviews.length === 0 && (
//             <Text color="gray.500">No reviews yet.</Text>
//           )}
//           <VStack spacing={4} align="stretch">
//             {reviews.map((review) => (
//               <Box
//                 key={review._id}
//                 p={4}
//                 border="1px"
//                 borderColor="gray.200"
//                 rounded="md"
//               >
//                 <HStack spacing={2}>
//                   {[...Array(5)].map((_, i) => (
//                     <StarIcon
//                       key={i}
//                       color={i < review.rating ? "yellow.400" : "gray.300"}
//                     />
//                   ))}
//                   <Text fontWeight="bold">
//                     {review.user?.fullName || "Anonymous"}
//                   </Text>
//                 </HStack>
//                 <Text mt={2}>{review.comment}</Text>
//               </Box>
//             ))}
//           </VStack>
//           {/* Review Form */}
//           {authUser && (
//             <Box mt={6} p={4} border="1px" borderColor="gray.200" rounded="md">
//               <Heading as="h3" size="md" mb={3}>
//                 Leave a Review
//               </Heading>
//               <form onSubmit={handleReviewSubmit}>
//                 <FormControl id="rating" mb={4}>
//                   <FormLabel>Rating</FormLabel>
//                   <HStack spacing={1}>
//                     {[...Array(5)].map((_, i) => (
//                       <StarIcon
//                         key={i}
//                         cursor="pointer"
//                         color={i < rating ? "yellow.400" : "gray.300"}
//                         onClick={() => setRating(i + 1)}
//                       />
//                     ))}
//                   </HStack>
//                 </FormControl>
//                 <FormControl id="comment" mb={4}>
//                   <FormLabel>Comment</FormLabel>
//                   <Textarea
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                   />
//                 </FormControl>
//                 <Button
//                   type="submit"
//                   colorScheme="blue"
//                   isLoading={reviewLoading}
//                 >
//                   Submit Review
//                 </Button>
//               </form>
//             </Box>
//           )}
//         </Box>
//       </Stack>
//       {/* Zoomable Image Modal */}
//       <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
//         <ModalOverlay />
//         <ModalContent bg="transparent" boxShadow="none" p={0}>
//           <ModalBody
//             p={0}
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//           >
//             <TransformWrapper
//               initialScale={1}
//               minScale={1}
//               maxScale={5}
//               wheel={{ step: 0.2 }}
//               doubleClick={{ disabled: false, step: 1.5 }}
//               pinch={{ step: 5 }}
//             >
//               {({ zoomIn, zoomOut, resetTransform }) => (
//                 <Box
//                   w="100vw"
//                   h="100vh"
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="center"
//                   position="relative"
//                 >
//                   <Box
//                     position="absolute"
//                     top={4}
//                     right={4}
//                     zIndex={10}
//                     display="flex"
//                     gap={2}
//                   >
//                     <IconButton
//                       aria-label="Zoom in"
//                       icon={<AiOutlineZoomIn />}
//                       onClick={zoomIn}
//                       colorScheme="teal"
//                       size="md"
//                       variant="solid"
//                     />
//                     <IconButton
//                       aria-label="Zoom out"
//                       icon={<span style={{ fontWeight: "bold" }}>-</span>}
//                       onClick={zoomOut}
//                       colorScheme="teal"
//                       size="md"
//                       variant="solid"
//                     />
//                     <IconButton
//                       aria-label="Reset zoom"
//                       icon={<span style={{ fontWeight: "bold" }}>⟳</span>}
//                       onClick={resetTransform}
//                       colorScheme="teal"
//                       size="md"
//                       variant="solid"
//                     />
//                     <IconButton
//                       aria-label="Close"
//                       icon={<span style={{ fontWeight: "bold" }}>×</span>}
//                       onClick={onClose}
//                       colorScheme="red"
//                       size="md"
//                       variant="solid"
//                     />
//                   </Box>
//                   <TransformComponent
//                     wrapperStyle={{
//                       width: "100vw",
//                       height: "100vh",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       background: "rgba(0,0,0,0.95)",
//                       zIndex: 9999,
//                     }}
//                     contentStyle={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       width: "100vw",
//                       height: "100vh",
//                     }}
//                   >
//                     <Image
//                       src={image}
//                       alt={name}
//                       borderRadius="lg"
//                       objectFit="contain"
//                       maxH="100vh"
//                       maxW="100vw"
//                       boxShadow="2xl"
//                       bg={useColorModeValue("white", "gray.900")}
//                     />
//                   </TransformComponent>
//                 </Box>
//               )}
//             </TransformWrapper>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Container>
//   );
// };

// export default ProductDetailsPage;

import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Stack,
  Image,
  Button,
  useColorModeValue,
  HStack,
  Flex,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  Container,
  VStack,
  Spinner,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { authStore } from "../store/authStore";
import { StarIcon } from "@chakra-ui/icons";
import { useProductStore } from "../store/useProductStore";
import { AiOutlineZoomIn } from "react-icons/ai";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import GoBackButton from "../components/GoBackButton";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser } = authStore();
  const toast = useToast();
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const {
    selectedProduct,
    reviews,
    loading,
    error,
    getProductById,
    addReview,
  } = useProductStore();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getProductById(id);
  }, [id, getProductById]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("zoom")) {
      onOpen();
    } else {
      onClose();
    }
  }, [location.search, onOpen, onClose]);

  const openZoomModal = () => {
    navigate(`?zoom=true`, { replace: false });
  };

  const closeZoomModal = () => {
    navigate(location.pathname, { replace: true });
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Alert status="error">
          <AlertIcon />
          <Heading color="red.500">Error: {error}</Heading>
        </Alert>
      </Flex>
    );
  }

  if (!selectedProduct) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Heading>Product Not Found</Heading>
      </Flex>
    );
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast({
        title: "Not logged in.",
        description: "Please log in to leave a review.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (rating === 0 || comment.trim() === "") {
      toast({
        title: "Invalid review.",
        description: "Please provide a rating and a comment.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setReviewLoading(true);

    const result = await addReview(id, { rating, comment });
    if (result.success) {
      await getProductById(id);
      setRating(0);
      setComment("");
      toast({
        title: "Review Submitted.",
        description: "Your review has been successfully submitted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Submission failed.",
        description: result.message || "Failed to submit review.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setReviewLoading(false);
  };

  const { name, price, description, image } = selectedProduct;

  return (
    <Container maxW={"container.xl"} py={10}>
      <Stack spacing={8}>
        <GoBackButton />
        {/* Product Details Section */}
        <Box
          p={6}
          rounded="lg"
          shadow="md"
          bg={useColorModeValue("white", "gray.800")}
        >
          <HStack spacing={4} alignItems="flex-start">
            <Box position="relative" w={{ base: "100%", md: "sm" }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-block", width: "100%" }}
              >
                <Image
                  src={image}
                  alt={name}
                  borderRadius="lg"
                  objectFit="cover"
                  h="80vh"
                  cursor="zoom-in"
                  onClick={openZoomModal}
                  tabIndex={0}
                  aria-label={`Zoom image of ${name}`}
                  _hover={{ boxShadow: "xl" }}
                  transition="all 0.2s"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openZoomModal();
                  }}
                  role="button"
                />
              </motion.div>
              <IconButton
                icon={<AiOutlineZoomIn />}
                aria-label="Zoom image"
                position="absolute"
                bottom={2}
                right={2}
                size="sm"
                onClick={openZoomModal}
                bg="whiteAlpha.800"
                _hover={{ bg: "whiteAlpha.900" }}
                zIndex={2}
                tabIndex={-1}
              />
            </Box>
            <VStack align="flex-start" spacing={4} flex={1}>
              <Heading as="h1" size="xl">
                {name}
              </Heading>
              <Text fontSize="lg" color="gray.500">
                {description}
              </Text>
              <Text fontWeight="bold" fontSize="2xl">
                ${price}
              </Text>
              <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    color={
                      i < selectedProduct.rating ? "yellow.400" : "gray.300"
                    }
                  />
                ))}
                <Text ml={2} fontSize="sm">
                  ({selectedProduct.numReviews} reviews)
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Box>
        <Divider />
        {/* Reviews Section */}
        <Box
          p={6}
          rounded="lg"
          shadow="md"
          bg={useColorModeValue("white", "gray.800")}
        >
          <Heading as="h2" size="lg" mb={4}>
            Reviews
          </Heading>
          {reviews.length === 0 && (
            <Text color="gray.500">No reviews yet.</Text>
          )}
          <VStack spacing={4} align="stretch">
            {reviews.map((review) => (
              <Box
                key={review._id}
                p={4}
                border="1px"
                borderColor="gray.200"
                rounded="md"
              >
                <HStack spacing={2}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      color={i < review.rating ? "yellow.400" : "gray.300"}
                    />
                  ))}
                  <Text fontWeight="bold">
                    {review.user?.fullName || "Anonymous"}
                  </Text>
                </HStack>
                <Text mt={2}>{review.comment}</Text>
              </Box>
            ))}
          </VStack>
          {/* Review Form */}
          {authUser && (
            <Box mt={6} p={4} border="1px" borderColor="gray.200" rounded="md">
              <Heading as="h3" size="md" mb={3}>
                Leave a Review
              </Heading>
              <form onSubmit={handleReviewSubmit}>
                <FormControl id="rating" mb={4}>
                  <FormLabel>Rating</FormLabel>
                  <HStack spacing={1}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        cursor="pointer"
                        color={i < rating ? "yellow.400" : "gray.300"}
                        onClick={() => setRating(i + 1)}
                      />
                    ))}
                  </HStack>
                </FormControl>
                <FormControl id="comment" mb={4}>
                  <FormLabel>Comment</FormLabel>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={reviewLoading}
                >
                  Submit Review
                </Button>
              </form>
            </Box>
          )}
        </Box>
      </Stack>
      {/* Zoomable Image Modal */}
      <Modal isOpen={isOpen} onClose={closeZoomModal} size="full" isCentered>
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none" p={0}>
          <ModalBody
            p={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              position="absolute"
              top={4}
              right={4}
              zIndex={10}
              display="flex"
              gap={2}
            >
              <IconButton
                aria-label="Close"
                icon={<span style={{ fontWeight: "bold" }}>×</span>}
                onClick={closeZoomModal}
                colorScheme="red"
                size="lg"
                variant="solid"
                rounded="full"
              />
            </Box>
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={5}
              wheel={{ step: 0.2 }}
              doubleClick={{ disabled: false, step: 1.5 }}
              pinch={{ step: 5 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <Box
                  w="100vw"
                  h="100vh"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                >
                  <Box
                    position="absolute"
                    top={4}
                    right={4}
                    zIndex={10}
                    display="flex"
                    gap={2}
                  >
                    <IconButton
                      aria-label="Zoom in"
                      icon={<AiOutlineZoomIn />}
                      onClick={zoomIn}
                      colorScheme="teal"
                      size="md"
                      variant="solid"
                    />
                    <IconButton
                      aria-label="Zoom out"
                      icon={<span style={{ fontWeight: "bold" }}>-</span>}
                      onClick={zoomOut}
                      colorScheme="teal"
                      size="md"
                      variant="solid"
                    />
                    <IconButton
                      aria-label="Reset zoom"
                      icon={<span style={{ fontWeight: "bold" }}>⟳</span>}
                      onClick={resetTransform}
                      colorScheme="teal"
                      size="md"
                      variant="solid"
                    />
                  </Box>
                  <TransformComponent
                    wrapperStyle={{
                      width: "100vw",
                      height: "100vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.95)",
                      zIndex: 9999,
                    }}
                    contentStyle={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100vw",
                      height: "100vh",
                    }}
                  >
                    <Image
                      src={image}
                      alt={name}
                      borderRadius="lg"
                      objectFit="contain"
                      maxH="100vh"
                      maxW="100vw"
                      boxShadow="2xl"
                      bg={useColorModeValue("white", "gray.900")}
                    />
                  </TransformComponent>
                </Box>
              )}
            </TransformWrapper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProductDetailsPage;
