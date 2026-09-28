import { useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "../config/api";
import { getSession } from "../authClient";

const emptyForm = { email: "", password: "", role: "Viewer" };

export default function Users() {
  const session = getSession();
  const isAdmin = session?.user?.role === "Admin";
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    if (!isAdmin) { setLoading(false); return; }
    try {
      setLoading(true); setError("");
      const response = await fetch(buildApiUrl("/users"));
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data.error || "Could not load users");
      setUsers(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  useEffect(() => { loadUsers(); }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? users.filter(u => [u.email, u.role, u.is_active ? "active" : "inactive"].some(v => String(v).toLowerCase().includes(q))) : users;
  }, [users, search]);

  async function createUser(event) {
    event.preventDefault(); setError(""); setMessage("");
    try {
      const response = await fetch(buildApiUrl("/users"), {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not create user");
      setForm(emptyForm); setMessage("User created successfully."); await loadUsers();
    } catch (err) { setError(err.message); }
  }

  async function updateUser(user, patch) {
    setError(""); setMessage("");
    try {
      const response = await fetch(buildApiUrl(`/users/${user.id}`), {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: user.role, isActive: user.is_active, ...patch }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not update user");
      setMessage("User access updated."); await loadUsers();
    } catch (err) { setError(err.message); }
  }

  if (!isAdmin) return <State title="Admin access required" text="User Management is restricted to CortexOS administrators." />;
  if (loading) return <State title="Loading users" text="Fetching registered CortexOS accounts." />;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>User Management</h2>
      <p style={styles.subtitle}>Manage real CortexOS accounts and role-based access. Passwords are hashed server-side.</p>
      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      <form onSubmit={createUser} style={styles.card}>
        <h3>Create user</h3>
        <div style={styles.grid}>
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} style={styles.input}/>
          <input required type="password" minLength={12} placeholder="Temporary password (12+ characters)" value={form.password} onChange={e => setForm({...form, password:e.target.value})} style={styles.input}/>
          <select value={form.role} onChange={e => setForm({...form, role:e.target.value})} style={styles.input}>
            <option>Viewer</option><option>Editor</option><option>Admin</option>
          </select>
          <button style={styles.primary}>Create user</button>
        </div>
      </form>

      <div style={styles.card}>
        <input placeholder="Search by email, role, or status" value={search} onChange={e=>setSearch(e.target.value)} style={{...styles.input,width:"100%",boxSizing:"border-box"}}/>
        <div style={{overflowX:"auto",marginTop:16}}>
          <table style={styles.table}>
            <thead><tr><th>Email</th><th>Role</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>{filtered.map(user => <tr key={user.id}>
              <td>{user.email}</td>
              <td><select value={user.role} onChange={e=>updateUser(user,{role:e.target.value})} disabled={Number(user.id)===Number(session.user.id)}><option>Viewer</option><option>Editor</option><option>Admin</option></select></td>
              <td><button onClick={()=>updateUser(user,{isActive:!user.is_active})} disabled={Number(user.id)===Number(session.user.id)} style={styles.action}>{user.is_active ? "Active" : "Inactive"}</button></td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>)}</tbody>
          </table>
        </div>
        {!filtered.length && <p style={styles.empty}>No users found.</p>}
      </div>
    </div>
  );
}

function State({title,text}) { return <div style={styles.card}><h2>{title}</h2><p style={styles.subtitle}>{text}</p></div>; }

const styles = {
  page:{padding:"8px 0 32px"}, title:{margin:0,color:"#0f172a"}, subtitle:{color:"#64748b",lineHeight:1.6},
  card:{marginTop:18,padding:22,border:"1px solid #e2e8f0",borderRadius:16,background:"#fff",boxShadow:"0 14px 30px rgba(15,23,42,.06)"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12},
  input:{padding:"11px 12px",border:"1px solid #cbd5e1",borderRadius:10,fontSize:14},
  primary:{border:0,borderRadius:10,padding:"11px 14px",background:"#2563eb",color:"#fff",fontWeight:700,cursor:"pointer"},
  table:{width:"100%",minWidth:700,borderCollapse:"collapse"}, action:{padding:"7px 11px",border:"1px solid #cbd5e1",borderRadius:8,background:"#f8fafc",cursor:"pointer"},
  error:{marginTop:16,padding:12,borderRadius:10,background:"#fef2f2",color:"#991b1b"}, success:{marginTop:16,padding:12,borderRadius:10,background:"#f0fdf4",color:"#166534"},
  empty:{textAlign:"center",color:"#64748b",padding:20}
};
