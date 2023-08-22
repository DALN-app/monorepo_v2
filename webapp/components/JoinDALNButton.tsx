import { Button, ButtonProps, ChakraProps, Flex } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useCallback } from "react";
import { PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";
import { useMutation } from "react-query";

interface SetAccessTokenResponse {
  success: true;
  plaidItemId: string;
}

const setAccessToken = async (public_token: string) => {
  const response = await axios.post("/api/set_access_token", {
    public_token,
  });
  return response.data;
};
interface JoinDALNButtonProps extends ButtonProps {
  linkToken?: string;
  onSuccess?: (data?: any, variables?: any, context?: any) => void;
}
export default function JoinDALNButton({
  linkToken,
  onClick = () => null,
  isDisabled,
  onSuccess = () => null,
  isLoading = false,
  ...props
}: JoinDALNButtonProps) {
  const { mutateAsync, isLoading: isLoadingSetAccessToken } = useMutation<
    SetAccessTokenResponse,
    AxiosError,
    string
  >(setAccessToken, {
    onSuccess(data, variables, context) {
      sessionStorage.setItem("plaidItemId", data.plaidItemId);
      onSuccess(data, variables, context);
    },
    onError(error) {
      console.log(`axios.post() failed: ${error}`);
    },
  });

  const sendPublicTokenToBackend: PlaidLinkOnSuccess = async (
    public_token,
    metadata
  ) => {
    await mutateAsync(public_token);
  };

  const { open, ready } = usePlaidLink({
    token: linkToken || "",
    onSuccess: sendPublicTokenToBackend,
  });

  return (
    <Flex justifyContent="center">
      <Button
        size="lg"
        maxWidth={382}
        flex={1}
        isLoading={isLoading || isLoadingSetAccessToken}
        isDisabled={!linkToken || !ready || isDisabled}
        onClick={() => open()}
        {...props}
      >
        Join DALN
      </Button>
    </Flex>
  );
}
