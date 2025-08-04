import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExternalLink, DollarSign, User, Building } from "lucide-react"

interface Invoice {
  id: string
  amount: number
  status: "paid" | "unpaid" | "pending"
  contractor: string
  client: string
  createdAt: string
  dueDate: string
}

interface InvoiceCardProps {
  invoice: Invoice
  showPayButton?: boolean
}

export function InvoiceCard({ invoice, showPayButton = false }: InvoiceCardProps) {
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
            <span className="text-sm font-mono text-gray-400">#{invoice.id}</span>
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
          <span className="text-2xl font-bold text-white">{invoice.amount.toLocaleString()}</span>
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

        {showPayButton && invoice.status === "unpaid" && (
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
            Pay Invoice
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
