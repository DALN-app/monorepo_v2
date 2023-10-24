import {
  Box,
  Center,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Text,
  WrapItem,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import JoinDALNButton from "~~/components/JoinDALNButton";
import ConnectedLayout from "~~/components/layouts/ConnectedLayout";
import Card from "~~/components/OnBoardingCard";
import useMutationCreateToken from "~~/hooks/useMutationCreateToken";
import { NextPageWithLayout } from "~~/pages/_app";

const NoTokenPage: NextPageWithLayout = () => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { isLoading, isError, data, mutate } = useMutationCreateToken({});
  const linkToken = data?.link_token;
  const router = useRouter();

  useEffect(() => {
    if (acceptTerms) {
      mutate();
    }
  }, [mutate, acceptTerms]);

  return (
    <Center
      sx={{
        flex: 1,
      }}
    >
      <Box alignSelf="center" width="80vw">
        <Text textAlign="center" fontSize="lg" mb={8} color="#4A5568">
          Not a DALN member yet?
        </Text>
        <Card>
          <Heading as="h1" size="lg" textAlign="center" mb={2}>
            Join the party 🥳
          </Heading>
          <Heading as="h2" size="md" textAlign="center" mb={10}>
            for true ownership and monetization of your data
          </Heading>
          <WrapItem alignSelf="center">
            <Box justifyContent="start" alignItems="start">
              <HStack spacing="8px" alignItems={{base:"start", lg:"end"}} mb={6} flexDirection={{ base: "column", lg: "row" }}>
                <Heading color={"primary.500"} as="h1" size="xl">
                  1. Download & Analyze
                </Heading>
                <Text fontSize="lg">credit card transactions</Text>
              </HStack>
              <HStack spacing="8px" alignItems={{base:"start", lg:"end"}} mb={6} flexDirection={{ base: "column", lg: "row" }}>
                <Heading color={"primary.500"} as="h1" size="xl">
                  2. Mint
                </Heading>
                <Text fontSize="lg">
                  a non-transferrable DAO membership token
                </Text>
              </HStack>
              <HStack spacing="8px" alignItems={{base:"start", lg:"end"}} mb={6} flexDirection={{ base: "column", lg: "row" }}>
                <Heading color={"primary.500"} as="h1" size="xl">
                  3. Get rewards
                </Heading>
                <Text fontSize="lg">from the aggregated data</Text>
              </HStack>
              <Flex mb={6}>
                <Checkbox
                  isChecked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                >
                  <Text fontSize="sm" mb={0.5}>
                    By checking the box, I agree to DALN&apos;s{" "}
                    <Link
                      href="https://www.google.com"
                      color={"primary.500"}
                      isExternal
                    >
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="https://www.google.com"
                      color={"primary.500"}
                      isExternal
                    >
                      Privacy Policy.
                    </Link>
                  </Text>
                </Checkbox>
              </Flex>
            </Box>
          </WrapItem>

          <Flex justifyContent="center">
            <JoinDALNButton
              linkToken={linkToken}
              isDisabled={!acceptTerms || isError || !linkToken}
              isLoading={isLoading}
            >
              Join DALN
            </JoinDALNButton>
          </Flex>
          <Flex justifyContent="center" mt={8}>
            <Text ml={2} maxWidth={660} fontSize="sm" align="center" color="#828282">
              We analyze your spending behaviors while the full credit card transaction data stays on your local device. Only the aggregated summaries are uploaded to a secure cloud storage.
            </Text>
          </Flex>
        </Card>
      </Box>
    </Center>
  );
};

NoTokenPage.getLayout = function getLayout(page) {
  return <ConnectedLayout>{page}</ConnectedLayout>;
};

export default NoTokenPage;
