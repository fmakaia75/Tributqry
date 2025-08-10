// Import ABIs (copy from artifacts)
import TributqryABI from './contracts/Tributqry.json'
import MockUSDCABI from './contracts/MockUSDC.json'
import { Address }from 'viem';
export const TRIBUTQRY_CONFIG = {
  address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as Address,
  abi: TributqryABI.abi
}

export const MOCK_USDC_CONFIG = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address, 
  abi: MockUSDCABI.abi
}
