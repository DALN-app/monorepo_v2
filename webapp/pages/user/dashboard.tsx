import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { QueryFunction, useQuery } from "react-query";
import { useAccount } from "wagmi";

import { NextPageWithLayout } from "../_app";

import { DashboardStat, BurnSBT } from "~~/components/Dashboard";
import ConnectedLayout from "~~/components/layouts/ConnectedLayout";
import PageTransition from "~~/components/PageTransition";
import { useFevmDalnMetadataUri } from "~~/generated/wagmiTypes";

const DALN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`;

const getTableLandMetadata: QueryFunction<any, string[]> = async ({
  queryKey,
}) => {
  const response = await axios.get(queryKey[0]);
  return response.data;
};

const Dashboard: NextPageWithLayout = () => {
  const tablelandMetadataURI = useFevmDalnMetadataUri({
    address: process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`,
  });
  const { address } = useAccount();
  const findByAddress = encodeURIComponent(
    ` WHERE address='${address?.toLowerCase()}'`
  );
  const {data} = useQuery(
    [`${tablelandMetadataURI.data}${findByAddress}` || ""],
    getTableLandMetadata,
    {
      enabled: !!tablelandMetadataURI.data && !!address,
      refetchInterval: 10000,
    }
  );

  const userTokenId = data && data[0]?.id;

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
          <Card w="full" pb="100px" mb={2}>
            <CardHeader>
              <Flex justifyContent="flex-end" alignItems="center">
                <BurnSBT tokenId={userTokenId} />
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
              <Stack spacing={5} maxWidth='3xl' mx='auto'>
                <DashboardStat
                  label="Token ID"
                  number={userTokenId}
                />
                <DashboardStat
                  label="SBT Contract"
                  number={
                    DALN_CONTRACT_ADDRESS.slice(0, 6) +
                    "..." +
                    DALN_CONTRACT_ADDRESS.slice(-5)
                  }
                  href={`https://calibration.filscan.io/en/address/${DALN_CONTRACT_ADDRESS}`}
                  linkText="View on Filscan"
                  isExternalHref
                />
                <DashboardStat label="TBA Address"  
                  number={
                    DALN_CONTRACT_ADDRESS.slice(0, 6) +
                    "..." +
                    DALN_CONTRACT_ADDRESS.slice(-5)
                  }
                  href={`https://opensea.io/${DALN_CONTRACT_ADDRESS}`}
                  linkText="View on OpenSea"
                  isExternalHref />
              </Stack>
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
