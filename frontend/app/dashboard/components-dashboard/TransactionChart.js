import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function TransactionChart({ transactions }) {
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Process transactions to calculate running balance and group by date
  const chartData = useMemo(() => {
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    // Calculate running balance
    let balance = 0;
    const data = sortedTransactions.map((transaction) => {
      balance += transaction.amount;
      return {
        date: format(transaction.date, "MMM dd"),
        month: format(transaction.date, "MMM"),
        amount: transaction.amount,
        balance,
        type: transaction.type,
      };
    });

    return data;
  }, [transactions]);

  // Filter transactions by month when a point is clicked
  const handleClick = (data) => {
    if (!data?.activePayload?.[0]?.payload?.month) return;

    const month = data.activePayload[0].payload.month;
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  // Filtered data based on selected month
  const filteredData = useMemo(() => {
    if (!selectedMonth) return chartData;
    return chartData.filter((item) => item.month === selectedMonth);
  }, [chartData, selectedMonth]);

  // Get min and max balance for chart scale with some padding
  const minBalance = Math.min(...chartData.map((item) => item.balance));
  const maxBalance = Math.max(...chartData.map((item) => item.balance));
  const yDomain = [
    Math.floor(minBalance - Math.abs(minBalance * 0.1)),
    Math.ceil(maxBalance + Math.abs(maxBalance * 0.1)),
  ];

  // Custom tooltip content
  const renderTooltip = (props) => {
    if (!props.active || !props.payload || !props.payload.length) {
      return null;
    }

    const data = props.payload[0].payload;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
        <p className="font-medium">{data.date}</p>
        <p className="text-sm text-gray-500">
          Balance:{" "}
          <span className="font-medium text-blue-600">
            ${data.balance.toFixed(2)}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          Transaction:{" "}
          <span
            className={`font-medium ${
              data.amount > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.amount > 0 ? "+" : ""}${data.amount.toFixed(2)}
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={filteredData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          onClick={handleClick}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            domain={yDomain}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={renderTooltip} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
            activeDot={{
              r: 6,
              stroke: "white",
              strokeWidth: 2,
            }}
            dot={{
              r: 4,
              stroke: "white",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {selectedMonth && (
        <div className="mt-2 text-center text-sm text-blue-700">
          Showing transactions for {selectedMonth}. Click again to show all.
        </div>
      )}
    </div>
  );
}
