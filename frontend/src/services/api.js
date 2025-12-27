const API_URL = "http://localhost:5000/api/transactions";

const getToken = () => localStorage.getItem("token");

// TRANSACTIONS API 

// Add a new transaction (income or expense)
export const addTransaction = async (transactionData) => {
  const token = getToken();
  // console.log('Request body:', req.body);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData), // { title, amount, date, type }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add transaction");
    return data;
  } catch (err) {
    console.error("Add Transaction Error:", err);
    throw err;
  }
};

// Get all transactions for the user
export const getTransactions = async (type) => {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}?type=${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to fetch transactions");
    return data;
  } catch (err) {
    console.error("Get Transactions Error:", err);
    throw err;
  }
};

// Update a transaction
export const updateTransaction = async (id, updatedData) => {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData), // { title, amount, date, type }
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to update transaction");
    return data;
  } catch (err) {
    console.error("Update Transaction Error:", err);
    throw err;
  }
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete transaction");
    }

    return true;
  } catch (err) {
    console.error("Delete Transaction Error:", err);
    throw err;
  }
};
const API = "http://localhost:5000/api/auth";



/**
 * Verify password before allowing username change
 */
export const verifyPassword = async (password) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/verify-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Password verification failed");
    return true;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

/**
 * Update username (after verifying password)
 */
export const updateUsername = async (newName) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/update-name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newName }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update username");
    return data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

/**
 * Update password
 */
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }), // ✅ send both
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update password");
    return data;
  } catch (err) {
    console.error("Update password error:", err.message);
    throw err;
  }
};


/**
 * Fetch income, expense, and balance stats for profile
 */
export const getUserStats = async (token) => {
  try {
      const headers = { Authorization: `Bearer ${token}` };
   
  const incomeRes = await fetch("http://localhost:5000/api/transactions?type=income", { headers });
  const expenseRes = await fetch("http://localhost:5000/api/transactions?type=expense", { headers });

    const incomeData = await incomeRes.json();
    const expenseData = await expenseRes.json();

    const totalIncome = incomeData.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = expenseData.reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    return { income: totalIncome, expense: totalExpense, balance };
  } catch (err) {
    console.error("Error fetching stats:", err);
    return { income: 0, expense: 0, balance: 0 };
  }
};


// export async function fetchWithAuth(url, method = "GET", body = null) {
//   // ✅ Get the token from localStorage
//   const token = localStorage.getItem("token");

//   // Build options for fetch
//   const options = {
//     method: method,
//     headers: {
//       Authorization: "Bearer " + token,
//       "Content-Type": "application/json",
//     },
//   };

//   // If we have a body (for POST/PUT), stringify it
//   if (body) {
//     options.body = JSON.stringify(body);
//   }

//   const res = await fetch(url, options);

//   // Check if user is deleted or token is invalid
//   if (res.status === 401) {
//     localStorage.removeItem("token"); // remove token
//     window.location.href = "/Login";
//     return;
//   }

//   const data = await res.json();
//   return data;
// }
