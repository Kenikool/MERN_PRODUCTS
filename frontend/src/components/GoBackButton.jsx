// components/GoBackButton.jsx
import { Button, Flex } from "@chakra-ui/react";
import { BackpackIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GoBackButton = ({ productId }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Option 1: Try to go back in history (preferred)
    navigate(-1);

    // Option 2: Fallback to explicit navigation if history is a problem
    // navigate(`/products/${productId}`);
  };

  return (
    <Flex justify="center" mb={6}>
      <Button
        leftIcon={<BackpackIcon />}
        colorScheme="gray"
        variant="outline"
        mt={4}
        onClick={handleGoBack}
      >
        Go Back
      </Button>
    </Flex>
  );
};

export default GoBackButton;
