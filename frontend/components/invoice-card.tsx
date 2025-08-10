import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExternalLink, DollarSign, User, Building } from "lucide-react"
import { useWriteContract, useWaitForTransactionReceipt, waitForTransactionReceipt } from "wagmi"
import { useEffect, useState } from "react"
import { TRIBUTQRY_CONFIG, MOCK_USDC_CONFIG } from "@/lib/contracts"
import { Loader2 } from "lucide-react"
interface Invoice {
  id: string
  amount: number
  status: "PAID" | "UNPAID" | "PENDING"
  contractor: string
  client: string
  createdAt: string
  dueDate: string
}

interface InvoiceCardProps {
  invoice: Invoice
  showPayButton?: boolean
  handleUpdate: (type:boolean, invoice: string)=>void
}

export function InvoiceCard({ invoice, showPayButton = false, handleUpdate}: InvoiceCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });


  const handlePayInvoice = async () => {
    if (isProcessing || isConfirming) return;
    setIsProcessing(true)
    try {

      await writeContract({
        address: MOCK_USDC_CONFIG.address, 
        abi: MOCK_USDC_CONFIG.abi,
        functionName: 'approve',
        args: [TRIBUTQRY_CONFIG.address, invoice.amount], 
      });

      writeContract({
        address: TRIBUTQRY_CONFIG.address,
        abi: TRIBUTQRY_CONFIG.abi,
        functionName: 'payInvoice',
        args: [invoice.id]
      });

    } catch (error) {
      console.log(error)
    } finally {
      setIsProcessing(false)
    }
  }
  useEffect(() => {
    if (isSuccess) {
      console.log('Payment confirmed!!')
      //wew need to update the status of the payment in the payableByMe Array
      handleUpdate(false,invoice.id)
    }
  }, [isSuccess])
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "unpaid":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono text-gray-400">#INV-{invoice.id.slice(0, 4)}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
          <Badge className={getStatusColor(invoice.status)}>{invoice.status.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-400" />
          <span className="text-2xl font-bold text-white">{(invoice.amount/1000000).toLocaleString()}</span>
          <span className="text-sm text-gray-400">USDC</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">Contractor:</span>
            <span className="text-white font-mono">{formatAddress(invoice.contractor)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">Client:</span>
            <span className="text-white font-mono">{formatAddress(invoice.client)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Created: {invoice.createdAt}</span>
          <span>Due: {invoice.dueDate}</span>
        </div>

        {showPayButton && invoice.status === "UNPAID" && (
          <Button onClick={handlePayInvoice} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
            {isProcessing || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isProcessing ? "Préparation..." : "Confirmation..."}
              </>
            ) : (
              "Pay Invoice"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
