import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  Link,
  LinkBox,
  LinkOverlay,
  Text,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Container,
  Flex,
} from "@chakra-ui/react";

interface DashboardItemProps {
  label: string;
  helpText?: string;
  number: string;
  href?: string;
  linkText?: string;
  isExternalHref?: boolean;
}

export default function DashboardItem({
  label,
  helpText,
  number,
  href,
  linkText,
  isExternalHref = false,
}: DashboardItemProps) {
  return (
    <Card
      position='relative'
      display="flex"
      justifyContent="center"
      alignItems="center"
      variant="outline"
    >
      {href && (
        <LinkOverlay href={href} isExternal={isExternalHref}>
          <Flex position='absolute' alignItems="center" top={0} right={0} p={2} fontSize="sm" fontWeight={'semibold'} color="primary.500"
            as={LinkBox}>

            <Text mr={2}>
              {linkText}
            </Text>
            <ExternalLinkIcon />
          </Flex>
        </LinkOverlay>
      )}
      <CardBody textAlign="center">
        <Stat>
          <StatNumber fontSize='28px' display="inline-block">{number}</StatNumber>
          {helpText && (
            <StatHelpText display="inline-block" ml={1}>
              {helpText}
            </StatHelpText>
          )}
          <StatLabel color="#4C5056" fontSize='2xl'>{label}</StatLabel>
        </Stat>
      </CardBody>
    </Card>
  );
}
