import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./Analytics.css";
import { analyticsService } from "../../services/analyticsService.js";
import useAuth from "../../hooks/auth/useAuth.js"

export default function AnalyticsUI() {
  const { user } = useAuth(); // ✅ Get user from Context
  const [mode, setMode] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [backendResult, setBackendResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // fetch when dates change or user logs in
  useEffect(() => {
    // ✅ GUARD: If no dates OR no user yet, don't make the request
    if (!startDate || !endDate || !user?._id) return;

    const loadAnalytics = async () => {
      try {
        setLoading(true);

        const result = await analyticsService.getAnalytics({
          userId: user._id, // ✅ Use user._id from context
          startDate,
          endDate,
        });

        setBackendResult(result);

        const formatted = (result?.wastedCategory || []).map((cat, index) => {
          const catSpent = cat.items?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
          // Logic fix: Subtracting 0 for now as 'saved' usually depends on budget or wasted logic
          // Adjust this calculation based on your specific backend requirements
          return {
            label: cat.category || `Category ${index + 1}`,
            spent: catSpent,
            saved: 0, 
          };
        });

        setData(formatted);
      } catch (err) {
        console.log("Analytics error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [startDate, endDate, user]); // ✅ Added 'user' to dependency array

  const handleSaveReport = async () => {
    if (!user?._id) return; // ✅ Prevent saving if user is missing

    try {
      setSaving(true);
      setSaveError(null);

      await analyticsService.saveAnalytics({
        userId: user._id, // ✅ Use user._id from context
        startDate,
        endDate,
        description,
      });

      setSaveSuccess(true);
      setDescription("");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      if (err?.response?.data?.statusCode === 409) {
        setSaveError("Analytics already saved for this period");
      } else {
        setSaveError("Failed to save report");
      }
    } finally {
      setSaving(false);
    }
  };

  /* SAFE DATA */
  const safeData =
    data.length > 0
      ? data
      : [{ label: "No Data", spent: 0, saved: 0 }];

  /* TOTALS */
  const totalSpent = backendResult?.totalCost || 0;
  const totalWasted = backendResult?.costWasted || 0;
  const totalSaved = totalSpent - totalWasted;
  const total = totalSpent;

  /* DONUT DATA */
  const donutData = [
    { name: "Spent", value: totalSpent, color: "#ef4444" },
    { name: "Wasted", value: totalWasted, color: "#f97316" },
    { name: "Saved", value: totalSaved >= 0 ? totalSaved : 0, color: "#22c55e" },
  ];

  return (
    <div className="container">

      {/* LOADING STATE */}
      {loading && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          Loading analytics...
        </div>
      )}

      {/* TOP CHART */}
      <div className="top">
        <div className="card large">
          <div className="card-header">
            <h3>Spent cost & Save cost</h3>

            <div className="tabs">
              <span className={mode === "daily" ? "active" : ""} onClick={() => setMode("daily")}>
                Daily
              </span>
              <span className={mode === "weekly" ? "active" : ""} onClick={() => setMode("weekly")}>
                Weekly
              </span>
              <span className={mode === "monthly" ? "active" : ""} onClick={() => setMode("monthly")}>
                Monthly
              </span>
            </div>
          </div>

          {/* DATE FILTER */}
          {mode === "daily" && (
            <div className="date-filter">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          )}

          {/* LINE CHART */}
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={safeData}>
                <defs>
                  <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#ccc" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis hide />
                <Tooltip />

                <Area dataKey="spent" fill="url(#blue)" />
                <Area dataKey="saved" fill="url(#green)" />

                <Line dataKey="spent" stroke="#ef4444" strokeWidth={3} />
                <Line dataKey="saved" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DONUT CHART */}
      <div className="card">
        <h3>Cost Breakdown</h3>

        <div className="donut-wrapper">
          <div className="donut-box">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER TEXT */}
            <div className="center-text">
              <div className="main-value">₹{total}</div>
              <div className="sub-text">Total cost</div>
            </div>
          </div>

          {/* LEGEND */}
          <div className="legend">
            <div><span className="dot red"></span> Total Spent: ₹{totalSpent}</div>
            <div><span className="dot orange"></span> Total Wasted: ₹{totalWasted}</div>
            <div><span className="dot green"></span> Total Saved: ₹{totalSaved}</div>
          </div>
        </div>
      </div>

      {/* SAVE REPORT */}
      {backendResult && !loading && (
        <div className="card" style={{ marginTop: "16px" }}>
          <h3>Save This Report</h3>

          {saveSuccess && (
            <p style={{ color: "#16a34a", marginBottom: "8px" }}>
              ✅ Report saved successfully!
            </p>
          )}

          {saveError && (
            <p style={{ color: "#dc2626", marginBottom: "8px" }}>
              ❌ {saveError}
            </p>
          )}

          <input
            type="text"
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              marginBottom: "8px"
            }}
          />

          <button
            onClick={handleSaveReport}
            disabled={saving || !startDate || !endDate}
            style={{
              background: "#22c55e",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {saving ? "Saving..." : "💾 Save Report"}
          </button>
        </div>
      )}

    </div>
  );
}