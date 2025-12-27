import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TransactionLineChart = ({ transactions = [], showDates = true }) => {
  if (!Array.isArray(transactions)) transactions = [];

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const labels = sortedTransactions.map((t) =>
    new Date(t.date).toLocaleDateString("en-GB")
  );

  // Map incomes and expenses
  const incomeData = sortedTransactions.map((t) =>
    t.type === "income" ? t.amount : 0
  );
  const expenseData = sortedTransactions.map((t) =>
    t.type === "expense" ? t.amount : 0
  );

  // CREDORA themed colors
  const credoraPurple = "#7b4bff";
  const credoraGreen = "#4ade80";
  const credoraRed = "#fb7185";

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: credoraGreen,
        backgroundColor: "rgba(74, 222, 128, 0.15)",
        pointBackgroundColor: credoraGreen,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: credoraRed,
        backgroundColor: "rgba(251, 113, 133, 0.15)",
        pointBackgroundColor: credoraRed,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e5e7eb",
          font: { size: 13 },
        },
      },
      title: {
        display: true,
        text: "Transactions Over Time",
        color: "#a78bfa",
        font: { size: 16, weight: "600" },
        padding: { bottom: 10 },
      },
      tooltip: {
        backgroundColor: "#121122",
        titleColor: "#fff",
        bodyColor: "#d1d5db",
        borderColor: "#7b4bff",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: showDates,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#9ca3af" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#9ca3af" },
      },
    },
  };

  return (
  <div
    style={{
      width: "100%",
      height: "300px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5rem",
      boxSizing: "border-box",
      overflow: "hidden", // ensures no overflow beyond card
    }}
  >
    <div style={{ width: "95%", height: "100%" }}>
      <Line data={data} options={options} />
    </div>
  </div>
);

};

export default TransactionLineChart;
