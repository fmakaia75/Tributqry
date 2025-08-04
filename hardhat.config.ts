import "@nomicfoundation/hardhat-toolbox";
//import { HardhatUserConfig } from "hardhat/config";

//const config: HardhatUserConfig = {
//  solidity: "0.8.28",
//};

//export default config;
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};
