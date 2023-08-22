import {
  useWaitForTransaction,
  usePrepareContractWrite,
  useContractWrite,
  UsePrepareContractWriteConfig,
  UseContractWriteConfig,
} from "wagmi";

export default function usePrepareWriteAndWaitTx(
  prepareOptions: UsePrepareContractWriteConfig
) {
  const isValid =
    prepareOptions &&
    prepareOptions.abi &&
    prepareOptions.address &&
    prepareOptions.functionName;

  const nonUndefinedAbi = prepareOptions.abi ? prepareOptions.abi : [];

  const prepareMutation = usePrepareContractWrite<
    typeof nonUndefinedAbi,
    string,
    number
  >(isValid ? prepareOptions : undefined);
  const writeMutation = useContractWrite(
    prepareMutation.config as UseContractWriteConfig
  );
  const resultTx = useWaitForTransaction({
    hash: writeMutation.data?.hash,
  });

  return {
    prepareMutation,
    writeMutation,
    resultTx,
    write: writeMutation.write,
    writeAsync: writeMutation.writeAsync,
    isLoading:
      prepareMutation.isLoading ||
      writeMutation.isLoading ||
      (writeMutation.isSuccess && !resultTx.data),
    isError:
      prepareMutation.isError || writeMutation.isError || resultTx.isError,
    error: prepareMutation.error || writeMutation.error || resultTx.error,
    isSuccess:
      prepareMutation.isSuccess &&
      writeMutation.isSuccess &&
      resultTx.isSuccess,
  };
}
