import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  useColorModeValue,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { Menu as MenuIcon, X, Sun, Moon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";

const NavLinks = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard", authRequired: true },
  { name: "Profile", path: "/profile", authRequired: true },
  { name: "Create-Product", path: "/create-product", authRequired: true },
];

const NavLink = ({ children, to, onClose }) => (
  <Button
    as={Link}
    to={to}
    onClick={onClose}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    variant="ghost"
  >
    {children}
  </Button>
);

export default function Navbar() {
  const { authUser, logout } = authStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const isAuthenticated = !!authUser;

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={8} alignItems={"center"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <X /> : <MenuIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Box fontWeight="bold" fontSize="xl">
            <Link to="/">Prostore</Link>
          </Box>
        </HStack>

        <HStack spacing={4} alignItems="center">
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {NavLinks.filter(
              (link) =>
                link.authRequired === undefined ||
                link.authRequired === isAuthenticated
            ).map((link) => (
              <NavLink key={link.name} to={link.path}>
                {link.name}
              </NavLink>
            ))}
          </HStack>

          <Flex alignItems={"center"}>
            <Button onClick={toggleColorMode} mr={4}>
              {colorMode === "light" ? <Moon /> : <Sun />}
            </Button>

            {isAuthenticated && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    name={authUser.fullName}
                    src={authUser.profilePic}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <Text fontWeight="bold">{authUser.fullName}</Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem as={Link} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout} icon={<LogOut size={16} />}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}

            {!isAuthenticated && (
              <HStack spacing={4} display={{ base: "none", md: "flex" }}>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Signup</NavLink>
              </HStack>
            )}
          </Flex>
        </HStack>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {NavLinks.filter(
              (link) =>
                link.authRequired === undefined ||
                link.authRequired === isAuthenticated
            ).map((link) => (
              <NavLink key={link.name} to={link.path} onClose={onClose}>
                {link.name}
              </NavLink>
            ))}
            {isAuthenticated && (
              <Menu>
                {" "}
                {/* Corrected: Wrap the mobile logout button in <Menu> */}
                <MenuList border="none" shadow="none" p={0}>
                  <MenuDivider />
                  <MenuItem
                    onClick={handleLogout}
                    rounded={"md"}
                    width="full"
                    justifyContent="flex-start"
                    icon={<LogOut size={18} />}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
