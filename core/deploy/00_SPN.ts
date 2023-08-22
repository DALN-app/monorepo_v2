import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

import { THardhatRuntimeEnvironmentExtended } from "~/helpers/types/THardhatRuntimeEnvironmentExtended";

const func: DeployFunction = async (
  hre: THardhatRuntimeEnvironmentExtended
) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const BasicSPN = await deploy("Basic_SPN_Factory", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  try {
    await hre.run("verify:verify", {
      address: BasicSPN.address,
    });
    console.log("Verified BasicSPN");
  } catch (err) {
    console.log("Failed to verify BasicSPN", err);
  }
};
export default func;
func.tags = ["Basic_SPN_Factory"];
