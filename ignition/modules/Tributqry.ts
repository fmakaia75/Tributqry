import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export const TributqryModule = buildModule("TributqryModule", (m) => {
  const mockUsdc = m.contract("MockUSDC");
  const tributqry = m.contract("Tributqry", [mockUsdc]);
  
  // Remove mint call - do it manually after
  return { mockUsdc, tributqry };
});

export default TributqryModule;
