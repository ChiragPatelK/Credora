import React, { useEffect, useState } from "react";
import "./Adminstyles.css";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      // Reverse for newest first
      setTransactions([...data].reverse());
    } catch (err) {
      console.error(err);
      alert("Error fetching transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

 // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/admin/transactions/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Delete failed");
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting transaction");
    }
  };

  // Edit transaction
  const handleEdit = async (t) => {
    const title = prompt("Update title:", t.title);
    const amount = prompt("Update amount:", t.amount);
    if (!title || !amount) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/admin/transactions/${t._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, amount }),
        }
      );
      if (!res.ok) throw new Error("Update failed");

      const updatedTransaction = await res.json();
      setTransactions((prev) =>
        prev.map((tr) => (tr._id === updatedTransaction._id ? updatedTransaction : tr))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating transaction");
    }
  };

  // Filter by search
  const filteredTransactions = transactions.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="transactions-wrap2">
      <div className="transactions-top">
        <h1>Manage Transactions</h1>
        <h3>View, edit, and manage all user transactions</h3>
      </div>

      <div className="transactions-controls">
        <input
          className="input"
          type="text"
          placeholder="🔍 Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="transactions-list-wrap">
        {filteredTransactions.length === 0 ? (
          <p className="empty">No transactions found.</p>
        ) : (
          <ul className="transactions-list">
            {filteredTransactions.map((t) => (
              <li
                key={t._id}
                className={`transaction-item ${t.type === "income" ? "income" : "expense"}`}
              >
                <div className="left">
                  <span className="title">{t.title}</span>
                  <span className="meta">
                    ₹{t.amount.toLocaleString()} • {t.type.toUpperCase()} •{" "}
                    {new Date(t.date).toLocaleDateString()}
                  </span>

                  {t.user && (
                    <span className="user-meta">
                      👤 <strong>{t.user.name || "Unknown User"}</strong>
                    </span>
                  )}
                </div>

                <div className="actions">
                  <button className="btn small edit" onClick={() => handleEdit(t)}>
                    ✏️ Edit
                  </button>
                  <button className="btn small del" onClick={() => handleDelete(t._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageTransactions;
