import {
  Box,
  Center,
  Heading,
  Text,
  Spinner,
  Card,
  Button,
  Flex,
  Container,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

import ConnectedLayout from "~~/components/layouts/ConnectedLayout";
import CheckMarkSvgComponent from "~~/components/svgComponents/CheckMarkSvgComponent";
import DataBaseSvgComponent from "~~/components/svgComponents/DataBaseSvgComponent";
import SuccessSvgComponent from "~~/components/svgComponents/SuccessSvgComponent";
import UploadUserDataProgressBar from "~~/components/UploadUserDataProgressBar";
import {
  fevmDalnABI
} from "~~/generated/wagmiTypes";
import usePrepareWriteAndWaitTx from "~~/hooks/usePrepareWriteAndWaitTx";
import { NextPageWithLayout } from "~~/pages/_app";

const steps = {
  downloading: {
    number: 1,
    title: "Downloading...",
    subtitle: "",
  },
  analyzing: {
    number: 2,
    title: "Analyzing data...",
    subtitle:
      "A computation job is run locally in your browser session",
  },
  analysisSuccess: {
    number: 3,
    title: "Analysis completed",
    subtitle:
      "Analytic results will be uploaded to a secure cloud storage. The results and visualizations are available in a token-gated personal dashboard.",
  },
  sharing: {
    number: 3.5,
    title: "Sharing analytics results...",
    subtitle:
      "Anonymized analytics results are being transmitted to a secure cloud storage. It helps us provide personalized offers and promotions from our partners.",
  },
  uploadSuccess: {
    number: 4,
    title: "Upload successful! Mint your token now",
    subtitle:
      "This non-transferrable token represents your DAO membership and grants you governance rights. You may receive airdrops in the token-bound account mapped to this token.",
  },
  minting: {
    number: 5,
    title: "Confirm minting in your wallet",
    subtitle:
      "You will be asked to review and confirm the gas fee payment from your wallet.",
  },
  mintSuccess: {
    number: 6,
    title: "Convert to a token-bound account (TBA)",
    subtitle:
      "The token will serve as a digital backpack where you can receive digital collectibles that match your interest and preferences.",
  },
  converting: {
    number: 7,
    title: "",
    subtitle:
      "",
  },
  convertSuccess: {
    number: 8,
    title: "Conversion successful",
    subtitle:
      "You can now receive airdrops in the token-bound account mapped to this token.",
  },
};

const UploadDataPage: NextPageWithLayout = () => {
  const [step, setStep] = useState<keyof typeof steps>("downloading");
  const [isConvertLoading, setIsConvertLoading] = useState(false);
  const progress = useMemo(
    // hardcode to 6 regardless of total number of steps
    () => Math.round((100 / 6) * steps[step].number),
    [step]
  );

  const { address: userAddress } = useAccount();

  const cid = sessionStorage.getItem("plaidItemId")

  const mintToken = usePrepareWriteAndWaitTx({
    address: process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`,
    abi: fevmDalnABI,
    functionName: "safeMint",
    args: [userAddress],
    enabled:
      !!process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS && !!userAddress,
  });

  console.log('mintToken', mintToken)

  const signHashProof = useSignMessage({
    message: 'Confirm to share analytic results',
    onSuccess: () => {
      setStep("sharing");
    }
  });

  useEffect(() => {
    if (step === "downloading") {
      const timer = setTimeout(() => {
        setStep("analyzing");
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (step === "analyzing") {
      const timer = setTimeout(() => {
        setStep("analysisSuccess");
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (step === "sharing") {
      const timer = setTimeout(() => {
        setStep("uploadSuccess");
      }, 3000);

      return () => clearTimeout(timer);
    }
    
  }, [step]);

  const mint = async () => {
    if (mintToken.writeAsync) {
      setStep("minting");
      try {
        await mintToken.writeAsync();
        setStep("mintSuccess");
        sessionStorage.removeItem("plaidItemId");
      } catch (e) {
        console.error(e);
        setStep("uploadSuccess");
      }
    }
  };

  const convertToken = async () => {
    // TODO: implement converstion of token to TBA

    // TEMPORARY: skip to convertSuccess
    const timer = setTimeout(() => {
      setStep("convertSuccess");
    }
      , 3000);

    return () => {
      setIsConvertLoading(false);
      clearTimeout(timer)
    }
  }

  return (
    <Center
      sx={{
        flex: 1,
      }}
    >
      <Box alignSelf="center" width="80vw" maxWidth={780} overflow={"hidden"}>
        <Heading as="h1" size="lg" textAlign="center" mb={2}>
          {steps[step].title}
        </Heading>
        <Text textAlign="center" fontSize="lg" mb={16} color="#4A5568">
          {steps[step].subtitle}
        </Text>
        <Center alignItems="center">
          {step === "mintSuccess" ? (
            <Container>
              <Flex flex={1} justifyContent="center">
                <SuccessSvgComponent />
              </Flex>
              <Flex flex={1} justifyContent="center" mt={20}>
                <Button
                  maxWidth={320}
                  size="lg"
                  flex={1}
                  mb={2}
                  isDisabled={!userAddress || isConvertLoading}
                  onClick={() => {
                    setIsConvertLoading(true)
                    void convertToken();
                  }}>
                  {isConvertLoading ? "Waiting for approval..." : "Convert"}
                </Button>
              </Flex>
            </Container>
          ) : step === "convertSuccess" ? (
            <Container>
              <Flex flex={1} justifyContent="center">
                <SuccessSvgComponent />
              </Flex>
              <Flex flex={1} justifyContent="center" mt={20}>
                <Link href="/user/dashboard">
                  <Button maxWidth={320} size="lg" flex={1} mb={2}>
                    View in dashboard
                  </Button>
                </Link>
              </Flex>
            </Container>
          ) : (
            <Card
              height={"300px"}
              maxWidth={"680px"}
              flex={1}
              borderStyle={step === "uploadSuccess" ? undefined : "dashed"}
              borderWidth={step === "uploadSuccess" ? undefined : 1}
              borderColor={
                step === "uploadSuccess" ? undefined : "rgba(0, 0, 0, 0.3)"
              }
              justifyContent="center"
            >
              {step === "analysisSuccess" ? (
                <Container>
                  <Center>
                    <CheckMarkSvgComponent />
                  </Center>
                  <Flex flex={1} justifyContent="center" mt={10}>
                    <Button
                      maxWidth={320}
                      size="lg"
                      flex={1}
                      mb={2}
                      isDisabled={!userAddress}
                      isLoading={signHashProof.isLoading}
                      onClick={() => {
                        void signHashProof.signMessage();
                      }}
                    >
                      Share results
                    </Button>
                  </Flex>
                </Container>
              ) : step === "uploadSuccess" || step === "minting" ? (
                <Container>
                  <Center>
                    <DataBaseSvgComponent />
                  </Center>
                  <Text textAlign="center" fontSize="md" color="#4A5568">
                    The token is free to mint but you will pay a small gas fee in FIL
                  </Text>
                  <Flex flex={1} justifyContent="center" mt={10}>
                    <Button
                      maxWidth={320}
                      size="lg"
                      flex={1}
                      mb={6}
                      isDisabled={!mintToken.write}
                      isLoading={mintToken.isLoading}
                      onClick={() => {
                        void mint();
                      }}
                    >
                      {step === "minting" ? "Waiting for approval..." : "Mint token"}
                    </Button>
                  </Flex>
                </Container>
              ) : (
                <Container centerContent>
                  <Spinner
                    alignSelf="center"
                    emptyColor="rgba(64, 117, 255, 0.2)"
                    color="#4075FF"
                    mb={6}
                    mt={"69px"}
                  />
                  <Text textAlign="center" fontSize="md" mb={1} color="#4A5568">
                    This may take a while...
                  </Text>{" "}
                  <Text
                    textAlign="center"
                    fontSize="md"
                    color="#4A5568"
                    mb={"69px"}
                  >
                    Please do not close your browser
                  </Text>
                </Container>
              )}
            </Card>
          )}
        </Center>
        {steps[step].number >= 6 ?
          <Container mb={6} /> :
          <UploadUserDataProgressBar progress={progress} />
        }
      </Box>
    </Center>
  );
};

UploadDataPage.getLayout = function getLayout(page) {
  return <ConnectedLayout>{page}</ConnectedLayout>;
};

export default UploadDataPage;
