import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  Text,
  useColorModeValue,
  useToast,
  IconButton,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { authStore } from "../store/authStore";
import { Camera, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, updateProfile, deleteAccount, loading } = authStore();
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    profilePic: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const onHandleDeleteClose = () => setIsDeleteOpen(false);
  const cancelRef = useRef();

  useEffect(() => {
    if (authUser) {
      setProfileData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        profilePic: authUser.profilePic,
      });
      setImagePreview(authUser.profilePic);
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileData({ ...profileData, profilePic: reader.result });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.fullName || !profileData.username || !profileData.email) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const success = await updateProfile(profileData);
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/signup");
    }
    onHandleDeleteClose();
  };

  if (!authUser) {
    return (
      <Box maxW={"container.xl"} py={12} textAlign="center">
        <Heading>Unauthorized</Heading>
        <Text mt={4}>Please log in to view and edit your profile.</Text>
      </Box>
    );
  }

  return (
    <VStack
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.900")}
      py={12}
    >
      <Box
        p={8}
        maxW="lg"
        w="full"
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="lg"
        rounded="lg"
      >
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Heading as="h2" size="xl">
            My Profile
          </Heading>

          <Box textAlign="center" position="relative">
            <Avatar size="2xl" name={profileData.fullName} src={imagePreview} />
            <Box
              position="absolute"
              bottom="0"
              right="0"
              bg={useColorModeValue("white", "gray.700")}
              rounded="full"
              p={1}
              shadow="md"
              cursor="pointer"
              onClick={handleImageClick}
              _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
            >
              <IconButton
                size="sm"
                aria-label="Upload profile picture"
                icon={<Camera size={18} />}
                variant="ghost"
                colorScheme="teal" // Added color scheme
              />
            </Box>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              display="none"
            />
          </Box>

          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            width="full"
            isLoading={loading}
          >
            Update Profile
          </Button>

          <Button
            onClick={() => setIsDeleteOpen(true)}
            colorScheme="red"
            variant="ghost"
            width="full"
            leftIcon={<Trash2 />}
          >
            Delete Account
          </Button>
        </VStack>
      </Box>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onHandleDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onHandleDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default ProfilePage;
