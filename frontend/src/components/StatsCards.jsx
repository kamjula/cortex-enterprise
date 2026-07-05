function StatsCards({ stats }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
        marginTop: 30,
      }}
    >
      {stats.map((item) => (
        <div
          key={item.title}
          style={{ background: "white", padding: 24, borderRadius: 16 }}
        >
          <p style={{ color: "#64748b" }}>{item.title}</p>
          <h2 style={{ color: "#111827" }}>{item.value}</h2>
          <p style={{ color: "#16a34a" }}>{item.change}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;