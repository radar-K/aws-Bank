"use client";
import React from "react";

export function StatCards({ balance, income, expenses }) {
  // Räkna in- och utgående transaktioner
  const incomingTransactions = 2; // Mock data
  const outgoingTransactions = 4; // Mock data

  // Veckovis förändring (mock data)
  const weeklyChange = 5.3;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Balance Card */}
      <div className="bg-white rounded-lg shadow-sm transition-shadow hover:shadow-lg">
        <div className="bg-blue-500 text-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/90">Total Balance</p>
                <h3 className="mt-1 text-3xl font-bold">
                  $
                  {balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>

              <div className="rounded-full bg-blue-600/50 p-3">
                <span className="text-2xl font-bold">$</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex ml-3 items-center relative -top-4">
            <div className="flex items-center rounded-full bg-blue-600/30 px-2 py-1 text-xs text-green-200">
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
                className="mr-1 h-3 w-3"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              {weeklyChange}%
            </div>
            <span className="ml-2 text-white/80">vs last week</span>
          </div>
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-white rounded-lg shadow-sm transition-shadow hover:shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Income</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                $
                {income.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className="rounded-full bg-green-100 p-3">
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
                className="h-6 w-6 text-green-600"
              >
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-medium">{incomingTransactions}</span> incoming
            transactions
          </p>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white rounded-lg shadow-sm transition-shadow hover:shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expenses</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                $
                {expenses.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
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
                className="h-6 w-6 text-red-600"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-medium">{outgoingTransactions}</span> outgoing
            transactions
          </p>
        </div>
      </div>
    </div>
  );
}
