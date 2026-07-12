import { useEffect, useState } from "react";

function DataQuality() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQualityChecks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5050/data-quality");

      if (!res.ok) {
        throw new Error("Failed to load data quality checks");
      }

      const data = await res.json();
      setChecks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQualityChecks();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Data Quality Dashboard</h2>
          <p>Monitor enterprise data quality in real time.</p>
        </div>

        <button onClick={loadQualityChecks}>Refresh</button>
      </div>

      {loading && <p>Loading quality checks...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th>Dataset</th>
                <th>Score</th>
                <th>Missing</th>
                <th>Duplicates</th>
                <th>Failed Rules</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {checks.map((item) => (
                <tr key={item.id}>
                  <td>{item.dataset_name}</td>
                  <td>{item.score}%</td>
                  <td>{item.missing_values}</td>
                  <td>{item.duplicate_records}</td>
                  <td>{item.failed_rules}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>Showing {checks.length} of {checks.length} quality checks</p>
        </>
      )}
    </div>
  );
}

export default DataQuality;