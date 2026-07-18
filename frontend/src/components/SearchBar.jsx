function SearchBar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}
    >
      <input
        type="text"
        placeholder="Search datasets..."
        style={{
          width: "min(320px, 100%)",
          padding: "11px 14px",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
          background: "#F8FAFC",
          color: "#0F172A",
          fontSize: "0.94rem",
          outline: "none",
        }}
      />

      <button
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)",
          color: "#FFFFFF",
          padding: "11px 18px",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: 700,
          boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
        }}
      >
        + Add Dataset
      </button>
    </div>
  );
}

export default SearchBar;