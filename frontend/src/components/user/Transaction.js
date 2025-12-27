import React, { useState, useEffect } from "react";
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../../services/api";
import "./transaction.css";
import TransactionsLineChart from "./LineChart";

function Transaction({ type }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [transactions, setTransactions] = useState([]);
  const [editingID, setEditingID] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTransactions();
  }, [type]);

  // Fetch all transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions(type, token);
      setTransactions(data);

      // Total calculation
      const totalAmount = data.reduce((sum, item) => sum + Number(item.amount), 0);
      setTotal(totalAmount);
    } catch (err) {
      console.error("❌ Unable to fetch transactions", err);
      alert("Unable to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  // Add transaction
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !amount || !date)
      return alert("Please enter title, amount, and date");

    try {
      const payload = { title, amount, date, type };
      const newTransaction = await addTransaction(payload, token);
      setTransactions([newTransaction, ...transactions]);
      setTitle("");
      setAmount("");
      setDate(today);
      fetchTransactions();
    } catch (err) {
      console.error("❌ Failed to add transaction", err);
      alert("Failed to add transaction");
    }
  };

  // Edit transaction
  const handleEdit = (transaction) => {
    setEditingID(transaction._id);
    setTitle(transaction.title);
    setAmount(transaction.amount);
    setDate(transaction.date ? transaction.date.split("T")[0] : "");
  };

  // Update transaction
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingID) return;

    try {
      const payload = { title, amount, date, type };
      const updated = await updateTransaction(editingID, payload, token);
      setTransactions(transactions.map((t) => (t._id === editingID ? updated : t)));
      setEditingID(null);
      setTitle("");
      setAmount("");
      setDate(today);
      fetchTransactions();
    } catch (err) {
      console.error("❌ Failed to update transaction", err);
      alert("Failed to update transaction");
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id, token);
      setTransactions(transactions.filter((t) => t._id !== id));
      fetchTransactions();
    } catch (err) {
      console.error("❌ Failed to delete transaction", err);
      alert("Failed to delete transaction");
    }
  };

  // Format numbers like 1K, 1M
  const formatAmount = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num;
  };

  return (
    <div className="transactions-wrap">
      {/* ===== HEADER SECTION ===== */}
      <div className="transactions-top">
        <h1>
          Total {type === "expense" ? "Expenses" : "Income"}: ₹
          {formatAmount(total)}
        </h1>

        <div className="chart">
          <TransactionsLineChart transactions={transactions} />
        </div>

        <h3>
          Manage your <span style={{ color: type === "expense" ? "#ef4444" : "#22c55e" }}>
            {type}
          </span>
        </h3>
      </div>

      {/* ===== FORM SECTION ===== */}
      <form
        className="transactions-form"
        onSubmit={editingID ? handleUpdate : handleAdd}
      >
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="input"
          placeholder="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
        />
        <button className="btn primary" type="submit">
          {editingID ? "Update" : "Add"}
        </button>
        {editingID && (
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setEditingID(null);
              setTitle("");
              setAmount("");
              setDate(today);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* ===== TRANSACTION LIST ===== */}
      <div className="transactions-list-wrap">
        {loading ? (
          <div className="loading">Loading…</div>
        ) : transactions.length === 0 ? (
          <div className="empty">
            No {type} yet — add one above.
          </div>
        ) : (
          <ul className="transactions-list">
            {transactions.map((t) => (
              <li
                className={`transaction-item ${t.type}`}
                key={t._id}
              >
                <div className="left">
                  <div className="title">{t.title}</div>
                  <div className="meta">
                    {new Date(t.date || t.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>

                <div className="right">
                  <div className="amount">
                    ₹{Number(t.amount).toLocaleString()}
                  </div>
                  <div className="actions">
                    <button
                      className="btn small edit"
                      onClick={() => handleEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn small del"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Transaction;
