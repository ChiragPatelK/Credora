import React, { useEffect, useState } from "react";
import "./Adminstyles.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
const handleAdd = async () => {
  const name = prompt("Enter user name:");
  const password = prompt("Enter user password:");
  if (!name || !password) return;

  //  Check if username already exists (case-insensitive)
  const existingUser = users.find(
    (u) => u.name.toLowerCase() === name.toLowerCase()
  );
  if (existingUser) {
    alert("❌ Username already exists! Choose a different name.");
    return;
  }

  try {
    const token = localStorage.getItem("adminToken");
    const res = await fetch("http://localhost:5000/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, password }),
    });

    if (!res.ok) throw new Error("Add failed");
    const newUser = await res.json();
    setUsers((prev) => [newUser, ...prev]);
  } catch (err) {
    console.error(err);
    alert("Error adding user");
  }
};

  // Edit user
  const handleEdit = async (user) => {
  const name = prompt("Update name:", user.name);
  if (!name) return;

  try {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(
      `http://localhost:5000/api/admin/users/${user._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      }
    );

    const data = await res.json(); // parse the response body first

    if (!res.ok) {
      // Show backend’s custom message (e.g. "Username already exists")
      alert(data.message || "Update failed");
      return;
    }

    // Update user list with new data
 if (data.user && data.user._id) {
  setUsers((prev) =>
    prev.map((u) => (u._id === data.user._id ? data.user : u))
  );
}

    alert("User updated successfully!");
    fetchUsers(); 
  } catch (err) {
    console.error("Edit user error:", err);
    alert("Error updating user. Please try again.");
  }
};


  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      

      if (!res.ok) throw new Error("Delete failed");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const filteredUsers = users.filter(
  (u) => u?.name?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="users-wrap">
      <div className="users-top">
        <h1>Manage Users</h1>
        <h3>View, add, and manage registered users</h3>
      </div>

      <div className="users-controls">
        <button className="btn primary" onClick={handleAdd}>
          + Add User
        </button>
        <input
          className="input"
          type="text"
          placeholder="🔍 Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="users-list-wrap">
        {filteredUsers.length === 0 ? (
          <p className="empty">No users found</p>
        ) : (
          <ul className="users-list">
            {filteredUsers.map((u) => (
              <li key={u._id} className="user-item">
                <div className="left">
                  <span className="title">{u.name}</span>
                  <span className="meta">ID: {u._id.slice(-6)}</span>
                </div>
                <div className="right actions">
                  <button className="btn small edit" onClick={() => handleEdit(u)}>
                    ✏️ Edit
                  </button>
                  <button className="btn small del" onClick={() => handleDelete(u._id)}>
                    🗑 Delete
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

export default ManageUsers;
