"use client"

import { useState, useEffect } from "react"
import { Header } from "./components/header"
import { DashboardSection } from "./components/dashboard-section"

// Mock data
const mockMyInvoices = [
  {
    id: "INV-001",
    amount: 2500,
    status: "paid" as const,
    contractor: "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
    client: "0x8ba1f109551bD432803012645Hac136c22C501e",
    createdAt: "2024-01-15",
    dueDate: "2024-02-15",
  },
  {
    id: "INV-002",
    amount: 1800,
    status: "unpaid" as const,
    contractor: "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
    client: "0x9cd1f109551bD432803012645Hac136c22C501f",
    createdAt: "2024-01-20",
    dueDate: "2024-02-20",
  },
  {
    id: "INV-003",
    amount: 3200,
    status: "pending" as const,
    contractor: "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
    client: "0xabc1f109551bD432803012645Hac136c22C501g",
    createdAt: "2024-01-25",
    dueDate: "2024-02-25",
  },
]

const mockInvoicesToPay = [
  {
    id: "INV-004",
    amount: 1500,
    status: "unpaid" as const,
    contractor: "0xdef1f109551bD432803012645Hac136c22C501h",
    client: "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
    createdAt: "2024-01-18",
    dueDate: "2024-02-18",
  },
  {
    id: "INV-005",
    amount: 2200,
    status: "unpaid" as const,
    contractor: "0xghi1f109551bD432803012645Hac136c22C501i",
    client: "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
    createdAt: "2024-01-22",
    dueDate: "2024-02-22",
  },
]

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* My Invoices Section */}
        <DashboardSection
          title="My Invoices"
          invoices={mockMyInvoices}
          isLoading={isLoading}
          emptyMessage="You haven't created any invoices yet"
        />

        {/* Invoices to Pay Section */}
        <DashboardSection
          title="Invoices to Pay"
          invoices={mockInvoicesToPay}
          isLoading={isLoading}
          showPayButton={true}
          emptyMessage="No pending invoices to pay"
        />
      </main>
    </div>
  )
}
