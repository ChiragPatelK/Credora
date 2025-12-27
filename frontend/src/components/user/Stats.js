import React, { useState, useEffect } from "react";
import "./Userstyle.css";
import { getTransactions } from "../../services/api";
import { useNavigate } from "react-router-dom";
import TransactionLineChart from "./LineChart";
import { FaMoneyBillWave, FaArrowCircleDown, FaPiggyBank } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Stats() {
  const navigate = useNavigate();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
         if (!token) navigate("/");
         
        const incomeData = await getTransactions("income", token);
        const expenseData = await getTransactions("expense", token);

        const totalIncome = incomeData.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpense = expenseData.reduce((sum, t) => sum + Number(t.amount), 0);

        setIncome(totalIncome);
        setExpense(totalExpense);
        setBalance(totalIncome - totalExpense);

        const allTransactions = [
          ...incomeData.map((t) => ({ ...t, type: "income" })),
          ...expenseData.map((t) => ({ ...t, type: "expense" })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(allTransactions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  // --- Donut chart color scheme (matches Credora theme) ---
  const donutData = {
    labels: ["Income", "Expenses", "Balance"],
    datasets: [
      {
        label: "Amount",
        data: [income, expense, balance],
        backgroundColor: [
          "rgba(34, 197, 94, 0.85)", // neon green for income
          "rgba(239, 68, 68, 0.85)", // red for expense
          "rgba(59, 130, 246, 0.85)", // blue for balance
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e2e8f0",
          font: { size: 14, weight: "600" },
          padding: 16,
        },
      },
    },
  };

  const formatAmount = (amount) => {
    if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1) + "B";
    if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + "M";
    if (amount >= 1_000) return (amount / 1_000).toFixed(1) + "K";
    return amount;
  };

  // ✅ Limit chart to last 20 transactions
  const chartTransactions =
    transactions.length > 20 ? transactions.slice(-20).reverse() : [...transactions].reverse();

  // ✅ Limit recent transactions to last 10
  const recentTransactions =
    transactions.length > 10 ? transactions.slice(0, 10) : transactions;

  return (
    <>
      {/* Top Summary */}
      <div className="Headers">
        <div className="stats-card income">
          <FaMoneyBillWave size={40} className="icon" />
          <h3>Income</h3>
          <p>₹{formatAmount(income)}</p>
        </div>

        <div className="stats-card expense">
          <FaArrowCircleDown size={40} className="icon" />
          <h3>Expenses</h3>
          <p>₹{formatAmount(expense)}</p>
        </div>

        <div className="stats-card balance">
          <FaPiggyBank size={40} className="icon" />
          <h3>Balance</h3>
          <p>₹{formatAmount(balance)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="chart-container">
        <div className="chart-card line">
          <TransactionLineChart transactions={chartTransactions} showDates={false} />
        </div>
        <div className="chart-card donut">
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        <div className="transactions-list">
          {recentTransactions.length === 0 ? (
            <p className="no-tx">No transactions found</p>
          ) : (
            recentTransactions.map((t) => (
              <div key={t._id || t.id} className={`transaction-item ${t.type}`}>
                <span className="transaction-title">{t.title}</span>
                <span className="transaction-amount">
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                </span>
                <span className="transaction-date">
                  {new Date(t.date).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Stats;
