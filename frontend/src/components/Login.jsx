import { useState } from "react";
import { login } from "../authClient";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <form onSubmit={submit} style={styles.card}>
        <div style={styles.brand}>CortexOS</div>
        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>Secure access to enterprise data operations.</p>
        <label style={styles.label}>Email
          <input style={styles.input} type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label style={styles.label}>Password
          <input style={styles.input} type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        {error && <div role="alert" style={styles.error}>{error}</div>}
        <button style={styles.button} type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#F8FAFC", fontFamily: "Inter, sans-serif" },
  card: { width: "min(420px, 100%)", padding: 32, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, boxShadow: "0 20px 50px rgba(15,23,42,.08)" },
  brand: { color: "#2563EB", fontWeight: 800, letterSpacing: ".04em" },
  title: { margin: "14px 0 6px", color: "#0F172A" },
  subtitle: { margin: "0 0 24px", color: "#64748B" },
  label: { display: "grid", gap: 7, marginTop: 16, color: "#334155", fontWeight: 600 },
  input: { width: "100%", boxSizing: "border-box", padding: "11px 12px", border: "1px solid #CBD5E1", borderRadius: 10, fontSize: 16 },
  error: { marginTop: 16, padding: 10, borderRadius: 8, background: "#FEF2F2", color: "#B91C1C" },
  button: { width: "100%", marginTop: 22, padding: "11px 14px", border: 0, borderRadius: 10, background: "#2563EB", color: "white", fontWeight: 700, cursor: "pointer" },
};
