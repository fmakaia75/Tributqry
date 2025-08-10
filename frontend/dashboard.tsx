
"use client"

import { useState, useEffect } from "react"
import { Header } from "./components/header"
import { DashboardSection } from "./components/dashboard-section"
import { usePublicClient, useAccount, useConfig } from 'wagmi'
import { TRIBUTQRY_CONFIG } from "./lib/contracts"
import { parseAbiItem } from 'viem'
import { Invoice } from "./components/dashboard-section"
export const InvoiceStatus: Record<number, string> = {
    0: "UNPAID",
    1: "PAID",
    2: "CANCELLED"
};

export default function Dashboard() {
    const { address: userAddress } = useAccount()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const publicClient = usePublicClient()
    const [createdInvoices, setCreatedInvoices] = useState<Invoice[]>([])
    const [payableInvoices, setPayableInvoices] = useState<Invoice[]>([])

    async function updateInvoiceList( type: boolean, invoiceId:string){
        //the bool define the type of contract if more use enum + switch case maybe
        const invoiceData = await publicClient.readContract({
            ...TRIBUTQRY_CONFIG,
            functionName: "getInvoice",
            args: [invoiceId]
        }) as Invoice

        const resInvoice =  {
            id: invoiceId,
            contractor: invoiceData.contractor,
            client: invoiceData.client,
            amount: Number(invoiceData.amount),
            status: InvoiceStatus[Number(invoiceData.status)] || "UNKNOWN",
            createdAt: invoiceData.createdAt,
            dueDate: invoiceData.dueDate
        } as Invoice
        
        if (type) {
            //add the new invoice to array of created invoices
            setCreatedInvoices(prev=> [...prev, resInvoice])
            console.log('Invoice has been updated')
        } else {
            //replace the invoice per its updated value 
            setPayableInvoices(prev=>
                prev.map(item=>(item.id === invoiceId ? resInvoice : item))
            )
            console.log('payable invoice has been updated')
        }
    }
    const loadInitialInvoices = async () => {
        if (!publicClient || !userAddress) return
        try {
            setIsLoading(true)

            // Get both types in parallel
            const [createdByMe, payableByMe] = await Promise.all([
                publicClient.getLogs({
                    address: TRIBUTQRY_CONFIG.address,
                    event: parseAbiItem('event InvoiceCreated(bytes32 indexed invoiceId, address indexed contractor, address indexed client)'),
                    args: { contractor: userAddress },
                    fromBlock: 'earliest',
                    toBlock: 'latest'
                }),
                publicClient.getLogs({
                    address: TRIBUTQRY_CONFIG.address,
                    event: parseAbiItem('event InvoiceCreated(bytes32 indexed invoiceId, address indexed contractor, address indexed client)'), 
                    args: { client: userAddress },
                    fromBlock: 'earliest',
                    toBlock: 'latest'
                })
            ])
            // Set separate states
            const invoiceCbmIds = createdByMe.map(log => (log.args as any).invoiceId)
            const invoicePbmIds = payableByMe.map(log => (log.args as any).invoiceId)
            const InvoiceCbm = await Promise.all(
                invoiceCbmIds.map(
                    async (invoiceId) => {
                        const invoiceData = await publicClient.readContract({
                            ...TRIBUTQRY_CONFIG,
                            functionName: "getInvoice",
                            args: [invoiceId]
                        }) as Invoice

                        return {
                            id: invoiceId,
                            contractor: invoiceData.contractor,
                            client: invoiceData.client,
                            amount: Number(invoiceData.amount),
                            status: InvoiceStatus[Number(invoiceData.status)] || "UNKNOWN",
                            createdAt: invoiceData.createdAt,
                            dueDate: invoiceData.dueDate
                        } as Invoice
                    }
                )
            )
            const InvoicePbmIs = await Promise.all(
                invoicePbmIds.map(
                    async (invoiceId) => {
                        const invoiceData = await publicClient.readContract({
                            ...TRIBUTQRY_CONFIG,
                            functionName: "getInvoice",
                            args: [invoiceId]
                        }) as Invoice

                        return {
                            id: invoiceId,
                            contractor: invoiceData.contractor,
                            client: invoiceData.client,
                            amount: Number(invoiceData.amount),
                            status: InvoiceStatus[Number(invoiceData.status)] || "UNKNOWN",
                            createdAt: invoiceData.createdAt,
                            dueDate: invoiceData.dueDate
                        } as Invoice
                    }
                )
            )
            setCreatedInvoices(InvoiceCbm)
            setPayableInvoices(InvoicePbmIs)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        loadInitialInvoices()
    }, [publicClient, userAddress])
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <Header handleUpdate={updateInvoiceList}/>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* My Invoices Section */}
                <DashboardSection
                    title="My Invoices"
                    invoices={createdInvoices}
                    isLoading={isLoading}
                    emptyMessage="You haven't created any invoices yet"
                />

                {/* Invoices to Pay Section */}
                <DashboardSection
                    title="Invoices to Pay"
                    invoices={payableInvoices}
                    isLoading={isLoading}
                    showPayButton={true}
                    emptyMessage="No pending invoices to pay"
                    handleUpdate={updateInvoiceList}
                />
            </main>
        </div>
    )
}
