import { useMemo, useState } from "react";

const initialUsers = [
  {
    id: 1,
    name: "Sravani Kamjula",
    email: "sravani@cortexos.com",
    role: "Admin",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: 2,
    name: "Daniel Brooks",
    email: "daniel@cortexos.com",
    role: "Data Engineer",
    status: "Active",
    lastActive: "12 minutes ago",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya@cortexos.com",
    role: "Data Analyst",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    name: "Michael Chen",
    email: "michael@cortexos.com",
    role: "Viewer",
    status: "Inactive",
    lastActive: "3 days ago",
  },
];

const initialForm = {
  name: "",
  email: "",
  role: "Data Analyst",
  status: "Active",
};

function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      );
    });
  }, [users, searchTerm]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const saveUser = () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email) {
      setMessage("Please enter the user name and email.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (editingId) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingId
            ? {
                ...user,
                ...form,
                name,
                email,
              }
            : user
        )
      );

      setMessage("User updated successfully.");
    } else {
      const newUser = {
        id: Date.now(),
        name,
        email,
        role: form.role,
        status: form.status,
        lastActive: "Not signed in yet",
      };

      setUsers((current) => [newUser, ...current]);
      setMessage("User added successfully.");
    }

    resetForm();
  };

  const editUser = (user) => {
    setEditingId(user.id);

    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteUser = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    setUsers((current) =>
      current.filter((user) => user.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }

    setMessage("User deleted successfully.");
  };

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "Admin"
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>User Management</h2>

          <p style={styles.subtitle}>
            Manage CortexOS users, roles, and account access.
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={users.length}
          description="All registered users"
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          description="Users with active access"
        />

        <StatCard
          title="Administrators"
          value={adminUsers}
          description="Users with admin role"
        />
      </div>

      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>
          {editingId ? "Edit User" : "Add New User"}
        </h3>

        <div style={styles.formGrid}>
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Admin">Admin</option>
            <option value="Data Engineer">
              Data Engineer
            </option>
            <option value="Data Analyst">
              Data Analyst
            </option>
            <option value="Viewer">Viewer</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div style={styles.formActions}>
          <button
            type="button"
            onClick={saveUser}
            style={styles.primaryButton}
          >
            {editingId ? "Update User" : "Add User"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={styles.secondaryButton}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {message && (
        <div
          style={{
            ...styles.messageCard,
            background: message.includes("Please")
              ? "#FEF2F2"
              : "#F0FDF4",
            borderColor: message.includes("Please")
              ? "#FECACA"
              : "#BBF7D0",
            color: message.includes("Please")
              ? "#991B1B"
              : "#166534",
          }}
        >
          {message}
        </div>
      )}

      <div style={styles.toolbar}>
        <input
          placeholder="Search users by name, email, role, or status..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          style={styles.searchInput}
        />
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Last Active</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>
                        {user.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <div style={styles.userName}>
                          {user.name}
                        </div>

                        <div style={styles.userEmail}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <span style={getRoleStyle(user.role)}>
                      {user.role}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <span
                      style={getStatusStyle(user.status)}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td style={styles.td}>
                    {user.lastActive}
                  </td>

                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        type="button"
                        onClick={() => editUser(user)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteUser(user.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={styles.emptyState}>
            No users found.
          </div>
        ) : (
          <div style={styles.footer}>
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, description }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTitle}>{title}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statDescription}>
        {description}
      </div>
    </div>
  );
}

function getRoleStyle(role) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.01em",
  };

  if (role === "Admin") {
    return {
      ...base,
      background: "rgba(124, 58, 237, 0.12)",
      color: "#6d28d9",
    };
  }

  if (role === "Data Engineer") {
    return {
      ...base,
      background: "rgba(37, 99, 235, 0.12)",
      color: "#1d4ed8",
    };
  }

  if (role === "Data Analyst") {
    return {
      ...base,
      background: "rgba(245, 158, 11, 0.16)",
      color: "#b45309",
    };
  }

  return {
    ...base,
    background: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
  };
}

function getStatusStyle(status) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "78px",
    padding: "6px 12px",
    borderRadius: "999px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.01em",
  };

  if (status === "Active") {
    return {
      ...base,
      background: "rgba(22, 163, 74, 0.14)",
      color: "#166534",
    };
  }

  return {
    ...base,
    background: "rgba(239, 68, 68, 0.12)",
    color: "#991b1b",
  };
}

const styles = {
  page: {
    padding: "8px 0 32px",
  },

  header: {
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "clamp(1.5rem, 2.3vw, 1.9rem)",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  statCard: {
    padding: "20px",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
  },

  statTitle: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 700,
  },

  statValue: {
    marginTop: "8px",
    color: "#0f172a",
    fontSize: "30px",
    fontWeight: 800,
  },

  statDescription: {
    marginTop: "4px",
    color: "#94a3b8",
    fontSize: "13px",
  },

  formCard: {
    marginBottom: "18px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
  },

  formTitle: {
    margin: "0 0 16px",
    color: "#0f172a",
    fontSize: "1.1rem",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },

  input: {
    boxSizing: "border-box",
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#FFFFFF",
    fontSize: "14px",
    color: "#0f172a",
  },

  formActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "14px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#FFFFFF",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.18)",
  },

  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "10px 16px",
    background: "#FFFFFF",
    color: "#334155",
    fontWeight: 700,
    cursor: "pointer",
  },

  messageCard: {
    marginBottom: "16px",
    padding: "13px 15px",
    border: "1px solid",
    borderRadius: "12px",
    fontWeight: 700,
  },

  toolbar: {
    marginBottom: "16px",
  },

  searchInput: {
    boxSizing: "border-box",
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#FFFFFF",
    fontSize: "14px",
    color: "#0f172a",
  },

  tableCard: {
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "900px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px 16px",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#FFFFFF",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 700,
  },

  td: {
    padding: "15px 16px",
    borderBottom: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "14px",
    verticalAlign: "middle",
    background: "#FFFFFF",
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "rgba(37, 99, 235, 0.12)",
    color: "#1d4ed8",
    fontWeight: 800,
  },

  userName: {
    color: "#0f172a",
    fontWeight: 700,
  },

  userEmail: {
    marginTop: "4px",
    color: "#64748b",
    fontSize: "13px",
  },

  actionButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  editButton: {
    border: "none",
    borderRadius: "8px",
    padding: "7px 11px",
    background: "rgba(37, 99, 235, 0.12)",
    color: "#1d4ed8",
    fontWeight: 700,
    cursor: "pointer",
  },

  deleteButton: {
    border: "none",
    borderRadius: "8px",
    padding: "7px 11px",
    background: "rgba(239, 68, 68, 0.12)",
    color: "#991b1b",
    fontWeight: 700,
    cursor: "pointer",
  },

  emptyState: {
    padding: "30px",
    color: "#64748b",
    textAlign: "center",
    background: "#f8fafc",
  },

  footer: {
    padding: "14px 18px",
    background: "#f8fafc",
    color: "#64748b",
    textAlign: "center",
    fontSize: "13px",
  },
};

export default Users;