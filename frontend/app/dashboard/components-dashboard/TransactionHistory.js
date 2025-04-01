"use client";
import React, { useState, useEffect, use } from "react";

export function TransactionHistory({ transactions }) {
  const [transaction, setTransactions] = useState([]);

  useEffect(() => {
    // Hämta transaktionerna från backend
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/transactions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Förutsatt att du lagrar JWT-tokenen i localStorage
          },
        });
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []); // Anropa funktionen för att hämta transaktionerna

  // Sortera transaktionerna efter datum (nyast först)
  const sortedTransactions = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Formatera datum till en läsbar sträng
  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Hämta ikonen för transaktionen baserat på typ
  const getTransactionIcon = (type, amount) => {
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
      case "expense":
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
      case "transfer":
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500€ uppercase tracking-wider w-[80px]"
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
                  {getTransactionIcon(transaction.type, transaction.amount)}
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
