import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Tab,
  Table,
  TableContainer,
  TabList,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  Table as TableType,
  useReactTable,
  CellContext as TanCellContext,
  RowData,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";

import IndeterminateCheckbox from "../atoms/IndeterminateCheckbox";
import DecryptButton from "../molecules/admin/dashboard/DecryptButton";
import EncryptedStatus from "../molecules/admin/dashboard/EncryptedStatus";

type Item = {
  encryptedCid: string;
  isDecrypted: boolean;
  walletAddress: string;
  tokenId?: number;
  sessionPayment: number;
};

// This is demo data, will be replaced with real data
const defaultData: Item[] = [
  {
    encryptedCid:
      "BuoW4MxSRnx14AtUMANfaqe9uJBGIeKoUt7mO9IAibMyOqrk78HVNG7PE3zZ_ZpNdGscs_kY_xvU9Fa0QjuFHA==",
    isDecrypted: true,
    walletAddress: "0xB0Ee2f94f0680d6131316d6056Dcf5827Abe492B",
    tokenId: 2,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "82cf7QgtXp7XVpeBdWenUxRAJDDTYnmGIDr7oxwEE2v8MlqjumztIcyYVEUGTQz3Igcy6iOq7qnyvmU1z_kMoQ==",
    isDecrypted: false,
    walletAddress: "0x72fC6D5f8759f812b8Ae1155A9A8ED4780678EeC",
    tokenId: 3,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "BuoW4MxSRnx14AtUMANfaqe9uJBGIeKoUt7mO9IAibMyOqrk78HVNG7PE3zZ_ZpNdGscs_kY_xvU9Fa0QjuFHA==",
    isDecrypted: true,
    walletAddress: "0xB0Ee2f94f0680d6131316d6056Dcf5827Abe492B",
    tokenId: 4,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "82cf7QgtXp7XVpeBdWenUxRAJDDTYnmGIDr7oxwEE2v8MlqjumztIcyYVEUGTQz3Igcy6iOq7qnyvmU1z_kMoQ==",
    isDecrypted: false,
    walletAddress: "0x72fC6D5f8759f812b8Ae1155A9A8ED4780678EeC",
    tokenId: 5,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "BuoW4MxSRnx14AtUMANfaqe9uJBGIeKoUt7mO9IAibMyOqrk78HVNG7PE3zZ_ZpNdGscs_kY_xvU9Fa0QjuFHA==",
    isDecrypted: true,
    walletAddress: "0xB0Ee2f94f0680d6131316d6056Dcf5827Abe492B",
    tokenId: 6,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "82cf7QgtXp7XVpeBdWenUxRAJDDTYnmGIDr7oxwEE2v8MlqjumztIcyYVEUGTQz3Igcy6iOq7qnyvmU1z_kMoQ==",
    isDecrypted: false,
    walletAddress: "0x72fC6D5f8759f812b8Ae1155A9A8ED4780678EeC",
    tokenId: 7,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "BuoW4MxSRnx14AtUMANfaqe9uJBGIeKoUt7mO9IAibMyOqrk78HVNG7PE3zZ_ZpNdGscs_kY_xvU9Fa0QjuFHA==",
    isDecrypted: true,
    walletAddress: "0xB0Ee2f94f0680d6131316d6056Dcf5827Abe492B",
    tokenId: 8,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "82cf7QgtXp7XVpeBdWenUxRAJDDTYnmGIDr7oxwEE2v8MlqjumztIcyYVEUGTQz3Igcy6iOq7qnyvmU1z_kMoQ==",
    isDecrypted: false,
    walletAddress: "0x72fC6D5f8759f812b8Ae1155A9A8ED4780678EeC",
    tokenId: 9,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "BuoW4MxSRnx14AtUMANfaqe9uJBGIeKoUt7mO9IAibMyOqrk78HVNG7PE3zZ_ZpNdGscs_kY_xvU9Fa0QjuFHA==",
    isDecrypted: true,
    walletAddress: "0xB0Ee2f94f0680d6131316d6056Dcf5827Abe492B",
    tokenId: 10,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "82cf7QgtXp7XVpeBdWenUxRAJDDTYnmGIDr7oxwEE2v8MlqjumztIcyYVEUGTQz3Igcy6iOq7qnyvmU1z_kMoQ==",
    isDecrypted: false,
    walletAddress: "0x72fC6D5f8759f812b8Ae1155A9A8ED4780678EeC",
    tokenId: 11,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "BuoW4MxSRnx14AtUMANfaqe9uJBGIeKoUt7mO9IAibMyOqrk78HVNG7PE3zZ_ZpNdGscs_kY_xvU9Fa0QjuFHA==",
    isDecrypted: true,
    walletAddress: "0xB0Ee2f94f0680d6131316d6056Dcf5827Abe492B",
    tokenId: 12,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "82cf7QgtXp7XVpeBdWenUxRAJDDTYnmGIDr7oxwEE2v8MlqjumztIcyYVEUGTQz3Igcy6iOq7qnyvmU1z_kMoQ==",
    isDecrypted: false,
    walletAddress: "0x72fC6D5f8759f812b8Ae1155A9A8ED4780678EeC",
    tokenId: 13,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "BuoW4MxSRnx14AtUMANfaqe9uJBGIeKoUt7mO9IAibMyOqrk78HVNG7PE3zZ_ZpNdGscs_kY_xvU9Fa0QjuFHA==",
    isDecrypted: true,
    walletAddress: "0xB0Ee2f94f0680d6131316d6056Dcf5827Abe492B",
    tokenId: 14,
    sessionPayment: 0.01,
  },
  {
    encryptedCid:
      "82cf7QgtXp7XVpeBdWenUxRAJDDTYnmGIDr7oxwEE2v8MlqjumztIcyYVEUGTQz3Igcy6iOq7qnyvmU1z_kMoQ==",
    isDecrypted: false,
    walletAddress: "0x72fC6D5f8759f812b8Ae1155A9A8ED4780678EeC",
    tokenId: 15,
    sessionPayment: 0.01,
  },
];

const columnHelper = createColumnHelper<Item>();

type CellContext<TData extends RowData, TValue> = TanCellContext<
  TData,
  TValue
> & {
  hover: boolean;
  setPressedDecryptRow: () => void;
};

const columns = [
  {
    id: "select",
    header: ({ table }: { table: TableType<Item> }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }: { row: Row<Item> }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },

  columnHelper.accessor("walletAddress", {
    header: () => "Holder Wallet Address",
    cell: (item) => (
      <Flex>
        <Text>{item.getValue()}</Text>
      </Flex>
    ),
  }),
  columnHelper.accessor("sessionPayment", {
    header: () => "Session Payment",
    cell: (item) => <Text>{item.getValue()} Matic</Text>,
  }),
  columnHelper.accessor("isDecrypted", {
    header: () => "Status",
    cell: (item: unknown) => {
      const itemCasted = item as CellContext<Row<Item>, boolean>;
      const isDecrypted = itemCasted.getValue();
      return isDecrypted && itemCasted.hover ? (
        <DecryptButton onClick={itemCasted.setPressedDecryptRow} />
      ) : (
        <EncryptedStatus isDecrypted={itemCasted.getValue()} />
      );
    },
  }),
];

const isDecryptedFilterFn: FilterFn<any> = (row, columnId, value, addMeta) => {
  const isDecrypted = value === "Decrypted";
  if (value) {
    return row.getValue("isDecrypted") === isDecrypted;
  }
  return true;
};

export default function AdminDataTable({
  onPaymentSuccess,
}: {
  onPaymentSuccess: (payment: {
    totalPaid: number;
    decryptedDataAmount: number;
  }) => void;
}) {
  const [data, setData] = React.useState(() => [...defaultData]);
  const [isMouseOverRowId, setIsMouseOverRowId] = useState("");

  const [pressedDecryptRow, setPressedDecryptRow] = useState<Row<Item> | null>(
    null
  );

  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [rowSelection, setRowSelection] = React.useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [statusFilter, setStatusFilter] = React.useState<
    null | "Decrypted" | "Encrypted"
  >(null);

  const handleTabsChange = (index: number) => {
    switch (index) {
      case 0:
        setStatusFilter(null);
        break;
      case 1:
        setStatusFilter("Encrypted");
        break;
      case 2:
        setStatusFilter("Decrypted");
        break;
      default:
        setStatusFilter(null);

        break;
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter: statusFilter,
    },
    enableRowSelection: (row) => {
      return !row.getValue("isDecrypted");
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: isDecryptedFilterFn,
    onGlobalFilterChange: setStatusFilter,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      isDecryptedFilterFn,
    },
  });

  const rowSelectedIds = Object.keys(rowSelection);
  const rowSelectedqty = rowSelectedIds.length;
  const rowSelectedTotalSessionPayment = useMemo(() => {
    rowSelectedIds;
    let totalSessionPaymentAux = 0;
    rowSelectedIds.forEach((id) => {
      const paymentAmount: number = table.getRow(id).getValue("sessionPayment");
      totalSessionPaymentAux += paymentAmount;
    });
    return totalSessionPaymentAux.toFixed(2);
  }, [table, rowSelectedIds]);

  useEffect(() => {
    if (pressedDecryptRow) {
      onOpen();
    }
  }, [pressedDecryptRow, onOpen]);

  return (
    <>
      <TableContainer>
        <Flex marginBottom={3} alignItems="center">
          <Tabs onChange={handleTabsChange}>
            <TabList>
              <Tab>All data</Tab>
              <Tab>Encrypted data</Tab>
              <Tab>Decrypted data</Tab>
            </TabList>
          </Tabs>
          <Spacer />
          {rowSelectedqty > 0 ? (
            <>
              <Text
                color={"gray.500"}
                fontSize="sm"
                marginX={6}
              >{`${rowSelectedTotalSessionPayment} Matic total session payment`}</Text>
              <Button minWidth={"220px"} onClick={onOpen}>
                <Text>{`${`Decrypt selected ${rowSelectedqty} data set${
                  rowSelectedqty > 1 ? "s" : ""
                }`}`}</Text>
              </Button>
            </>
          ) : null}
        </Flex>
        <Box overflowY="auto" maxHeight="60vh">
          <Table
            colorScheme="gray"
            overflow="hidden"
            borderRadius="lg"
            borderBottom="2px solid white"
          >
            <Thead bgColor="#E6EDF9">
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody bgColor="white" fontSize="sm">
              {table.getRowModel().rows.map((row: Row<Item>) => {
                return (
                  <Tr
                    key={row.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#F1F4F9",
                      },
                    }}
                    onMouseEnter={() => {
                      setIsMouseOverRowId(row.id);
                    }}
                    onMouseLeave={() => {
                      setIsMouseOverRowId("");
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                          hover: row.id === isMouseOverRowId,
                          setPressedDecryptRow: () => setPressedDecryptRow(row),
                        })}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </TableContainer>
      <>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setPressedDecryptRow(null);
            onClose();
          }}
          isCentered
          size="sm"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader alignSelf="center">Decrypt Data</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex justifyContent="space-between" mb={2}>
                <Text>Data sets #</Text>
                <Text>{pressedDecryptRow ? 1 : rowSelectedqty}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>Total Payment</Text>
                <Text>
                  {pressedDecryptRow
                    ? pressedDecryptRow.getValue("sessionPayment")
                    : rowSelectedTotalSessionPayment}{" "}
                  Matic
                </Text>
              </Flex>
            </ModalBody>

            <ModalFooter justifyContent={"space-between"}>
              {isWaitingForApproval ? (
                <Button size={"lg"} flex={1} isDisabled={true}>
                  Waiting for approval...
                </Button>
              ) : (
                <>
                  <Button
                    size={"lg"}
                    width={"150px"}
                    variant="ghost"
                    onClick={() => {
                      setPressedDecryptRow(null);
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size={"lg"}
                    width={"150px"}
                    onClick={() => {
                      setIsWaitingForApproval(true);
                    }}
                  >
                    Confirm
                  </Button>
                </>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
}
