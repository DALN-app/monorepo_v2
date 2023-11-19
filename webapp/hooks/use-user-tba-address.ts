import { useNetwork } from "wagmi";
import { useErc6551RegistryAccount } from "~~/generated/wagmiTypes";
import { useUserTokenId } from "./use-user-token-id";
import { BigNumber } from "@ethersproject/bignumber";

const DALN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`;
const ERC6551_REGISTRY_ADDRESS = "0xD700C17F46Dc803Efb7301e60137c3E42B5BBEEf"
const ERC6551_ACCOUNT_ADDRESS = "0x147dE0f37a15E75D8d1a734E07e8AD03453a57B8"

export function useUserTbaAddress() {
    const userTokenId = useUserTokenId();
    const { chain } = useNetwork();
    const { data: userTbaAddress } = useErc6551RegistryAccount({
        address: ERC6551_REGISTRY_ADDRESS,
        args: [
            ERC6551_ACCOUNT_ADDRESS,
            BigNumber.from(chain?.id),
            DALN_CONTRACT_ADDRESS,
            userTokenId,
            BigNumber.from(1) //salt,
        ],
        enabled: !!userTokenId,
        watch: false,
    });

    return userTbaAddress
}
