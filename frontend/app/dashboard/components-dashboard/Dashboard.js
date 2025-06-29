"use client";
import React, { useState, useEffect } from "react";
import { TransactionChart } from "./TransactionChart";
import { TransactionHistory } from "./TransactionHistory";
import { ActionCards } from "./ActionCards";
import { StatCards } from "./StatCards";

export function Dashboard() {
  const [transactions, setTransactions] = useState([
    {
      id: "1",
      date: new Date(2025, 0o4, 1),
      description: "Salary",
      amount: 3000,
      type: "pay",
      category: "Income",
    },
    {
      id: "4",
      date: new Date(2025, 0o4, 15),
      description: "Side Project",
      amount: 500,
      type: "deposit",
      category: "Utilities",
    },

    {
      id: "6",
      date: new Date(2025, 0o4, 25),
      description: "Transfer to Savings",
      amount: -300,
      type: "send",
      recipient: "Savings Account",
    },
  ]);

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const token = () => localStorage.getItem("token");

  // Calculate financial statistics
  useEffect(() => {
    const newBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const newIncome = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const newExpenses = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    setBalance(newBalance);
    setIncome(newIncome);
    setExpenses(newExpenses);
  }, [transactions]);

  // Add new transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Financial Dashboard</h1>

      {/* Stats Cards */}
      <StatCards balance={balance} income={income} expenses={expenses} />

      {/* Action Cards */}
      <ActionCards addTransaction={addTransaction} />

      {/* Transaction History */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="mb-3 font-semibold text-lg">Transaction History</div>
        <TransactionHistory transactions={transactions} />
      </div>

      {/* Transaction Overview */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="mb-3 font-semibold text-lg">Transaction Overview</div>
        <TransactionChart transactions={transactions} />
      </div>
    </div>
  );
}
