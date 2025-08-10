"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { TRIBUTQRY_CONFIG } from '@/lib/contracts'
import { parseEventLogs, parseUnits} from 'viem'

type InvoiceFormProps = {
  walletAddress: string,
  handleNewInvoice: (type:boolean, invoiceId: string)=>void
}

export function InvoiceForm({ walletAddress, handleNewInvoice }: InvoiceFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    contractorAddress: walletAddress,
    clientAddress: "",
    amount: "",
  })
  const { data: hash, writeContract } = useWriteContract()

  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // useEffect pour success
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(isSuccess)
      setFormData({
        contractorAddress: walletAddress,
        clientAddress: "",
        amount: "",
      })
    }
    if (receipt) {
      const logs = parseEventLogs({
        abi: TRIBUTQRY_CONFIG.abi,
        logs: receipt.logs,
        eventName: 'InvoiceCreated'
      })

      if (logs.length > 0) {
        const invoiceId = (logs[0] as any).args.invoiceId

        handleNewInvoice(
          true,
          invoiceId
        )
      }
    }
  }, [isSuccess, receipt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { contractorAddress, clientAddress, amount } = formData

    if (!contractorAddress || !clientAddress || !amount) {
      alert("Remplis tous les champs requis")
      return
    }
    const amountInUnits = parseUnits(amount, 6)
    writeContract({
      ...TRIBUTQRY_CONFIG,
      functionName: 'createInvoice',
      args: [contractorAddress, clientAddress, amountInUnits],
    })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSuccess) {
    return (
      <Dialog>
        <DialogContent className="bg-gray-900/50 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create New Invoice</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 mt-4">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <Plus className="h-6 w-6 text-green-400 rotate-45" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Invoice Created Successfully!</h3>
              <p className="text-gray-400">Your invoice has been submitted to the blockchain.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Invoice</span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractorAddress" className="text-gray-300">
                  My Address
                </Label>
                <Input
                  id="contractorAddress"
                  name="contractorAddress"
                  value={walletAddress}
                  placeholder={walletAddress}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientAddress" className="text-gray-300">
                  Client Address
                </Label>
                <Input
                  id="clientAddress"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleChange}
                  placeholder="0x..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-300">
                  Amount (USDC)
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="1000"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              {/*
    <div className="space-y-2">
    <Label htmlFor="dueDate" className="text-gray-300">
    Due Date
    </Label>
    <Input
    id="dueDate"
    name="dueDate"
    type="date"
    value={formData.dueDate}
    onChange={handleChange}
    className="bg-gray-800 border-gray-700 text-white"
    required
    />
    </div>
    */}
            </div>

            {
              /*
                 <div className="space-y-2">
                 <Label htmlFor="description" className="text-gray-300">
                 Description (Optional)
                 </Label>
                 <Textarea
                 id="description"
                 name="description"
                 value={formData.description}
                 onChange={handleChange}
                 placeholder="Brief description of work completed..."
                 className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
                 />
                 </div>
                 */
            }

            <Button
              type="submit"
              disabled={isConfirming}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Invoice...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
