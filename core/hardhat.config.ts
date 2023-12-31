import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-etherscan";

dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  namedAccounts: {
    deployer: {
      mumbai: "0xD5Ee68E025b751C199e766a261c59AE7041A1E9b", //it can also specify a specific netwotk name (specified in hardhat.config.js)
      filecoinCalibration: "0xD5Ee68E025b751C199e766a261c59AE7041A1E9b",
    },
  },
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [process.env.MUMBAI_PRIVATE_KEY],
      name: "mumbai",
      chainId: 80001,
    },
    filecoinCalibration: {
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: [process.env.FEVM_TESTNET_PRIVATE_KEY],
      name: "Filecoin Calibration",
      chainId: 314159,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
