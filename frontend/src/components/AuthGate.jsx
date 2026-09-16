import { useEffect, useState } from "react";
import Login from "./Login";
import { clearSession, getSession, logout } from "../authClient";

export default function AuthGate({ children }) {
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    const expired = () => {
      clearSession();
      setSession(null);
    };
    window.addEventListener("cortex-auth-expired", expired);
    return () => window.removeEventListener("cortex-auth-expired", expired);
  }, []);

  if (!session) return <Login onLogin={() => setSession(getSession())} />;

  async function signOut() {
    await logout();
    setSession(null);
  }

  return (
    <>
      {children}
      <button type="button" onClick={signOut} style={styles.logout} title={`Signed in as ${session.user.email}`}>
        Sign out
      </button>
    </>
  );
}

const styles = {
  logout: { position: "fixed", right: 24, bottom: 20, zIndex: 1000, border: "1px solid #CBD5E1", borderRadius: 10, padding: "9px 13px", background: "#FFFFFF", color: "#334155", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(15,23,42,.1)" },
};
