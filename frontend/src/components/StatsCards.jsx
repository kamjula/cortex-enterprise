function StatsCards({ stats }) {
  const getChangeStyle = (change) => {
    if (change === "Needs Review") {
      return { color: "#F59E0B", background: "#FEF3C7" };
    }

    if (change === "Database") {
      return { color: "#16A34A", background: "#DCFCE7" };
    }

    return { color: "#2563EB", background: "#DBEAFE" };
  };

  return (
    <div style={styles.grid}>
      {stats.map((item) => (
        <div key={item.title} style={styles.card}>
          <p style={styles.label}>{item.title}</p>
          <h2 style={styles.value}>{item.value}</h2>
          <p style={{ ...styles.change, ...getChangeStyle(item.change) }}>
            {item.change}
          </p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    background: "#FFFFFF",
    padding: "22px 20px",
    borderRadius: "18px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minHeight: "132px",
    justifyContent: "space-between",
  },

  label: {
    margin: 0,
    color: "#64748B",
    fontSize: "0.86rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },

  value: {
    margin: 0,
    color: "#0F172A",
    fontSize: "1.9rem",
    lineHeight: 1.15,
  },

  change: {
    display: "inline-flex",
    alignSelf: "flex-start",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: 700,
    margin: 0,
  },
};

export default StatsCards;