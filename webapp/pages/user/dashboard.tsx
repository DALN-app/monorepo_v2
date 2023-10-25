import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  Stack,
} from "@chakra-ui/react";
import Head from "next/head";

import { NextPageWithLayout } from "../_app";
import { DashboardStat, BurnSBT } from "~~/components/Dashboard";
import ConnectedLayout from "~~/components/layouts/ConnectedLayout";
import PageTransition from "~~/components/PageTransition";
import { useUserTokenId } from '../../hooks/use-user-token-id'
import { useUserTbaAddress } from '../../hooks/use-user-tba-address'

const DALN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`;


const Dashboard: NextPageWithLayout = () => {

  const userTokenId = useUserTokenId();
  const userTbaAddress = useUserTbaAddress();


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
                  href={`https://calibration.filfox.info/address/${DALN_CONTRACT_ADDRESS}`}
                  linkText="View on Filscan"
                  isExternalHref
                />
                {userTbaAddress && (
                  <DashboardStat label="TBA Address"
                    number={
                      userTbaAddress.slice(0, 6) +
                      "..." +
                      userTbaAddress.slice(-5)
                    }
                    href={`https://testnets.opensea.io/${userTbaAddress}`}
                    linkText="View on OpenSea"
                    isExternalHref />
                )}
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
