import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceCard } from "./invoice-card"
import { Skeleton } from "@/components/ui/skeleton"

interface Invoice {
  id: string
  amount: number
  status: "paid" | "unpaid" | "pending"
  contractor: string
  client: string
  createdAt: string
  dueDate: string
}

interface DashboardSectionProps {
  title: string
  invoices: Invoice[]
  isLoading?: boolean
  showPayButton?: boolean
  emptyMessage?: string
}

export function DashboardSection({
  title,
  invoices,
  isLoading = false,
  showPayButton = false,
  emptyMessage = "No invoices found",
}: DashboardSectionProps) {
  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-full bg-gray-800" />
                <Skeleton className="h-4 w-3/4 bg-gray-800" />
                <Skeleton className="h-20 w-full bg-gray-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-gray-400">
            {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center opacity-80">
                <span className="text-white text-xs">+</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {title === "My Invoices" ? "No invoices created yet" : "No pending payments"}
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {title === "My Invoices"
                ? "Start by creating your first invoice to get paid for your work in the DAO ecosystem."
                : "You're all caught up! No invoices are waiting for your payment at the moment."}
            </p>
            {title === "My Invoices" && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <div className="text-sm text-gray-500">Ready to get started? →</div>
                <div className="text-sm text-blue-400 font-medium">Click "Create Invoice" above</div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} showPayButton={showPayButton} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
