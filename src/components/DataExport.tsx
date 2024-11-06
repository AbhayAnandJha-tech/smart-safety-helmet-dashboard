import React, { useState } from "react";
import { DateRangePicker, Range } from "react-date-range";
import { exportSafetyData } from "../services/exportService";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/DataExport.css";

export const DataExport: React.FC = () => {
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      setError("Please select a date range");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await exportSafetyData(dateRange[0].startDate, dateRange[0].endDate);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to export data");
      console.error("Export error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-export">
      <h2>Export Safety Data</h2>
      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Data exported successfully!</div>
      )}
      <div className="date-picker-container">
        <DateRangePicker
          onChange={(item) => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          months={2}
          direction="horizontal"
        />
      </div>
      <button
        className="export-button"
        onClick={handleExport}
        disabled={loading}
      >
        {loading ? "Exporting..." : "Export Data"}
      </button>
    </div>
  );
};
