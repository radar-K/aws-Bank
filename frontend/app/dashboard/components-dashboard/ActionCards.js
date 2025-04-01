"use client";
import React, { useState } from "react";

export function ActionCards({ addTransaction }) {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositCategory, setDepositCategory] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billCategory, setBillCategory] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const apiCall = async (url, method, data) => {
    const token = getToken();

    if (!token) {
      setError("You need to be logged in to perform this action");
      return null;
    }

    try {
      const response = await fetch(
        `ec2-13-49-18-194.eu-north-1.compute.amazonaws.com${url}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: data ? JSON.stringify(data) : undefined,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      return await response.json();
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsLoading(true);
    setError(null);

    const transactionData = {
      description: `Quick Deposit${
        depositCategory ? ` - ${depositCategory}` : ""
      }`,
      amount,
      type: "deposit",
      category: depositCategory || "Income",
    };

    // First update UI for immediate feedback
    addTransaction(transactionData);

    // Then send to backend
    const result = await apiCall("/transactions", "POST", transactionData);

    if (result) {
      // Clear form fields
      setDepositAmount("");
      setDepositCategory("");
    }

    setIsLoading(false);
  };

  const handlePayBill = async () => {
    const amount = parseFloat(billAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsLoading(true);
    setError(null);

    const transactionData = {
      description: `Bill Payment${billCategory ? ` - ${billCategory}` : ""}`,
      amount: -amount,
      type: "expense",
      category: billCategory || "Bills",
    };

    // First update UI for immediate feedback
    addTransaction(transactionData);

    // Then send to backend
    const result = await apiCall("/transactions", "POST", transactionData);

    if (result) {
      // Clear form fields
      setBillAmount("");
      setBillCategory("");
    }

    setIsLoading(false);
  };

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsLoading(true);
    setError(null);

    const transactionData = {
      description: `Transfer${
        transferRecipient ? ` to ${transferRecipient}` : ""
      }`,
      amount: -amount,
      type: "transfer",
      recipient: transferRecipient || "Other Account",
    };

    // First update UI for immediate feedback
    addTransaction(transactionData);

    // Then send to backend
    const result = await apiCall("/transactions", "POST", transactionData);

    if (result) {
      // Clear form fields
      setTransferAmount("");
      setTransferRecipient("");
    }

    setIsLoading(false);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {error && (
        <div className="col-span-3 bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

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
              disabled={!depositAmount || isLoading}
            >
              {isLoading ? "Processing..." : "Deposit"}
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
              disabled={!billAmount || isLoading}
            >
              {isLoading ? "Processing..." : "Pay"}
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
              disabled={!transferAmount || isLoading}
            >
              {isLoading ? "Processing..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
