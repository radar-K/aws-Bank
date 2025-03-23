"use client";
import React, { useState } from "react";

export function ActionCards({ addTransaction }) {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositCategory, setDepositCategory] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billCategory, setBillCategory] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    addTransaction({
      description: `Quick Deposit${
        depositCategory ? ` - ${depositCategory}` : ""
      }`,
      amount,
      type: "deposit",
      category: depositCategory || "Income",
    });

    setDepositAmount("");
    setDepositCategory("");
  };

  const handlePayBill = () => {
    const amount = parseFloat(billAmount);
    if (isNaN(amount) || amount <= 0) return;

    addTransaction({
      description: `Bill Payment${billCategory ? ` - ${billCategory}` : ""}`,
      amount: -amount,
      type: "expense",
      category: billCategory || "Bills",
    });

    setBillAmount("");
    setBillCategory("");
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) return;

    addTransaction({
      description: `Transfer${
        transferRecipient ? ` to ${transferRecipient}` : ""
      }`,
      amount: -amount,
      type: "transfer",
      recipient: transferRecipient || "Other Account",
    });

    setTransferAmount("");
    setTransferRecipient("");
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Quick Deposit Card */}
      <div className="bg-white rounded-lg shadow-sm transition-shadow hover:shadow-lg">
        <div className="p-6">
          <div className="mb-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <span className="text-green-500 text-lg font-bold">$</span>
            </div>
            <h3 className="ml-3 font-semibold text-gray-900">Quick Deposit</h3>
          </div>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Category"
              value={depositCategory}
              onChange={(e) => setDepositCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              className="w-full rounded-md bg-green-600 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={handleDeposit}
              disabled={!depositAmount}
            >
              Deposit
            </button>
          </div>
        </div>
      </div>

      {/* Pay Bills Card */}
      <div className="bg-white rounded-lg shadow-sm transition-shadow hover:shadow-lg">
        <div className="p-6">
          <div className="mb-4 flex items-center">
            <div className="rounded-full bg-red-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-red-600"
              >
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className="ml-3 font-semibold text-gray-900">Pay Bills</h3>
          </div>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Amount"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Category"
              value={billCategory}
              onChange={(e) => setBillCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              className="w-full rounded-md bg-red-600 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={handlePayBill}
              disabled={!billAmount}
            >
              Pay
            </button>
          </div>
        </div>
      </div>

      {/* Send Money Card */}
      <div className="bg-white rounded-lg shadow-sm transition-shadow hover:shadow-lg">
        <div className="p-6">
          <div className="mb-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-blue-600"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
            <h3 className="ml-3 font-semibold text-gray-900">Send Money</h3>
          </div>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Recipient"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={handleTransfer}
              disabled={!transferAmount}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
