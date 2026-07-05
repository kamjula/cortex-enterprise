function SearchBar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <input
        type="text"
        placeholder="Search datasets..."
        style={{
          width: "300px",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "14px",
        }}
      />

      <button
        style={{
          background: "#2563eb",
          color: "white",
          padding: "12px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        + Add Dataset
      </button>
    </div>
  );
}

export default SearchBar;