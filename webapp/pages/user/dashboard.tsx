import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { QueryFunction, useQuery } from "react-query";
import { useAccount } from "wagmi";

import { NextPageWithLayout } from "../_app";

import { DashboardStat, BurnSBT } from "~~/components/Dashboard";
import ConnectedLayout from "~~/components/layouts/ConnectedLayout";
import PageTransition from "~~/components/PageTransition";
import { useBasicSpnFactoryMetadataUri } from "~~/generated/wagmiTypes";
import { watch } from "fs";

const getTableLandMetadata: QueryFunction<any, string[]> = async ({
  queryKey,
}) => {
  const response = await axios.get(queryKey[0]);
  return response.data;
};

const Dashboard: NextPageWithLayout = () => {
  const tablelandMetadataURI = useBasicSpnFactoryMetadataUri({
    address: process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { address } = useAccount();

  const findByAddress = encodeURIComponent(
    ` WHERE address='${address?.toLowerCase()}'`
  );

  const tablelandMetadata = useQuery(
    [`${tablelandMetadataURI.data}${findByAddress}` || ""],
    getTableLandMetadata,
    {
      enabled: !!tablelandMetadataURI.data && !!address,
      refetchInterval: 5000,
    }
  );

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
          <Card w="full">
            <CardHeader>
              <Flex justifyContent="flex-end" alignItems="center">
                <BurnSBT tokenId={tablelandMetadata?.data?.[0]?.id} />
              </Flex>

              <Heading
                as="h1"
                size="md"
                fontWeight={500}
                textAlign="center"
                mb={2}
              >
                Manage DALN membership token
              </Heading>
            </CardHeader>

            <CardBody>
              <SimpleGrid columns={[1, 2]} spacing={5}>
                <DashboardStat label="Rewards" helpText="Matic" number="1.27" />
                <DashboardStat label="Decryption Sessions" number="5" />
                <DashboardStat
                  label="Token ID"
                  number={tablelandMetadata?.data?.[0]?.id}
                />
                <DashboardStat
                  label="SBT Contract"
                  number={
                    (
                      process.env
                        .NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`
                    ).slice(0, 6) +
                    "..." +
                    (
                      process.env
                        .NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`
                    ).slice(-5)
                  }
                  href={`https://mumbai.polygonscan.com/address/${
                    process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as string
                  }`}
                  isExternalHref
                />
              </SimpleGrid>
            </CardBody>
          </Card>
        </Container>
      </PageTransition>
    </>
  );
};

Dashboard.getLayout = function getLayout(page) {
  return <ConnectedLayout>{page}</ConnectedLayout>;
};

export default Dashboard;
