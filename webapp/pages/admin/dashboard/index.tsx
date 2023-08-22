import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  Text,
  Wrap,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import { AdminDataTable } from "~~/components/AdminDashboard";
import ConnectedLayout from "~~/components/layouts/ConnectedLayout";
import NavBar from "~~/components/NavBar";
import PageTransition from "~~/components/PageTransition";
import BackChevronSvgComponent from "~~/components/svgComponents/BackChevronSvgComponent";
import { NextPageWithLayout } from "~~/pages/_app";

const AdminDashboard: NextPageWithLayout = () => {
  const router = useRouter();

  const [successPayment, setSuccessPayment] = useState<{
    totalPaid: number;
    decryptedDataAmount: number;
  } | null>({ totalPaid: 12, decryptedDataAmount: 1 });

  const onPaymentSuccess = ({
    totalPaid,
    decryptedDataAmount,
  }: {
    totalPaid: number;
    decryptedDataAmount: number;
  }) => {
    setSuccessPayment({ totalPaid, decryptedDataAmount });
  };
  return (
    <>
      <Head>
        <title>DALN - Dashboard</title>
      </Head>
      <PageTransition>
        <Container
          maxW="container.xl"
          mt={{
            base: 4,
            md: 16,
            lg: 24,
          }}
        >
          <Card w="full" size="lg">
            <CardHeader>
              <Flex
                alignItems={"center"}
                onClick={() => {
                  router.back();
                }}
              >
                <BackChevronSvgComponent />
                <Text ml={4}>Back to dashboard</Text>
              </Flex>
              <Heading
                as="h1"
                size="md"
                fontWeight={500}
                textAlign="center"
                mt={4}
              >
                Manage DALN Data
              </Heading>
              {successPayment ? (
                <Flex justifyContent={"center"} mt={4}>
                  <Alert
                    w={400}
                    status="success"
                    borderRadius={12}
                    justifyContent={"center"}
                    borderColor={"#5BA85A"}
                    borderWidth={1}
                  >
                    <Wrap>
                      <AlertIcon />
                      <Box>
                        <AlertTitle color={"#5BA85A"}>
                          {`Successfully decrypted ${successPayment.decryptedDataAmount} data set`}
                        </AlertTitle>
                        <AlertDescription color={"#5BA85A"}>
                          {`  Total ${successPayment.totalPaid} Matic paid to token holder`}
                        </AlertDescription>
                      </Box>
                    </Wrap>
                  </Alert>
                </Flex>
              ) : null}
            </CardHeader>

            <CardBody>
              <AdminDataTable onPaymentSuccess={onPaymentSuccess} />
            </CardBody>
          </Card>
        </Container>
      </PageTransition>
    </>
  );
};

AdminDashboard.getLayout = function getLayout(page) {
  return <ConnectedLayout>{page}</ConnectedLayout>;
};

export default AdminDashboard;
