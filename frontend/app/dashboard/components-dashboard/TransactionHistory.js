"use client";
import React, { useState, useEffect } from "react";

// Demo transactions som visas när man inte är inloggad
const DEMO_TRANSACTIONS = [
  {
    id: "demo-1",
    description: "Salary Deposit",
    amount: 3500.0,
    transaction_type: "deposit",
    category: "Income",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 dag sedan
  },
  {
    id: "demo-2",
    description: "Grocery Shopping",
    amount: -89.5,
    transaction_type: "pay",
    category: "Food",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dagar sedan
  },
  {
    id: "demo-3",
    description: "Transfer to Mom",
    amount: -200.0,
    transaction_type: "send",
    recipient: "Mom",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 dagar sedan
  },
  {
    id: "demo-4",
    description: "Electric Bill",
    amount: -125.75,
    transaction_type: "pay",
    category: "Bills",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 dagar sedan
  },
  {
    id: "demo-5",
    description: "Freelance Payment",
    amount: 850.0,
    transaction_type: "deposit",
    category: "Income",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 vecka sedan
  },
];

export function TransactionHistory({ transactions: propTransactions = [] }) {
  const [backendTransactions, setBackendTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          // Ingen token - visa demo data
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Convert date strings to Date objects
        const transactionsWithDates = data.map((transaction) => ({
          ...transaction,
          date: new Date(transaction.date),
        }));

        setBackendTransactions(transactionsWithDates);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        // Vid fel, visa demo data istället
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-500">Loading transactions...</div>
      </div>
    );
  }

  // Bestäm vilka transaktioner som ska visas
  const allTransactions = isLoggedIn
    ? [...backendTransactions, ...propTransactions]
    : [...DEMO_TRANSACTIONS, ...propTransactions];

  // Sort transactions by date (newest first)
  const sortedTransactions = [...allTransactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Format date to readable string
  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
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
              className="h-4 w-4 text-green-600"
            >
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </div>
        );
      case "pay":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
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
              className="h-4 w-4 text-red-600"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
        );
      case "send":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
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
              className="h-4 w-4 text-blue-600"
            >
              <polyline points="17 1 21 5 17 9"></polyline>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <polyline points="7 23 3 19 7 15"></polyline>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      {!isLoggedIn && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            📊 You're viewing demo transactions.{" "}
            <strong>Create an account</strong> to save your real transactions!
          </p>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTransactions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          ) : (
            sortedTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTransactionIcon(
                    transaction.transaction_type || transaction.type
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {transaction.description}
                  </div>
                  {transaction.category && (
                    <div className="text-xs text-gray-500">
                      Category: {transaction.category}
                    </div>
                  )}
                  {transaction.recipient && (
                    <div className="text-xs text-gray-500">
                      Recipient: {transaction.recipient}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {formatDate(transaction.date)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                    transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount >= 0 ? "+" : ""}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
