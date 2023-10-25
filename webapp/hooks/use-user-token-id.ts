import axios from "axios";
import { QueryFunction, useQuery } from "react-query";
import { useAccount } from "wagmi";
import { useFevmDalnMetadataUri } from "~~/generated/wagmiTypes";

const getTableLandMetadata: QueryFunction<any, string[]> = async ({
    queryKey,
}) => {
    const response = await axios.get(queryKey[0]);
    return response.data;
};

export function useUserTokenId() {
    const tablelandMetadataURI = useFevmDalnMetadataUri({
        address: process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`,
    });
    const { address } = useAccount();
    const findByAddress = encodeURIComponent(
        ` WHERE address='${address?.toLowerCase()}'`
    );
    const { data } = useQuery(
        [`${tablelandMetadataURI.data}${findByAddress}` || ""],
        getTableLandMetadata,
        {
            enabled: !!tablelandMetadataURI.data && !!address,
            refetchInterval: 10000,
        }
    );

    const userTokenId = data && data[0]?.id;

    return userTokenId;

};
