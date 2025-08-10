import { InvoiceForm } from "./invoice-form"

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
export type HeaderProps = {
  handleUpdate: ( type: boolean, invoiceId: string) => void
}
export function Header({handleUpdate}: HeaderProps) {

  const { address, isConnected } = useAccount()
  return (
    <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-xl font-bold text-white">Tributqry</h1>
            </div>
            <ConnectButton />
          </div>

          {isConnected && address && (<div className="flex items-center space-x-4">
            <InvoiceForm walletAddress={address} handleNewInvoice={handleUpdate} />
          </div>)}
        </div>
      </div>
    </header>
  )
}
