import { useState } from "react";
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

/* ✅ DAILY WITH REAL DATES */
const dailyData = [
    { date: "2026-05-01", label: "Mon", spent: 40, saved: 20 },
    { date: "2026-05-02", label: "Tue", spent: 60, saved: 30 },
    { date: "2026-05-03", label: "Wed", spent: 30, saved: 95 },
    { date: "2026-05-04", label: "Thu", spent: 80, saved: 50 },
    { date: "2026-05-05", label: "Fri", spent: 55, saved: 45 },
    { date: "2026-05-06", label: "Sat", spent: 30, saved: 40 },
    { date: "2026-05-07", label: "Sun", spent: 120, saved: 35 },
    { date: "2026-05-08", label: "Mon", spent: 20, saved: 98 },
    { date: "2026-05-09", label: "Tue", spent: 70, saved: 55 },
    { date: "2026-05-10", label: "Fri", spent: 10, saved: 69 },
];

const weeklyData = [
    { label: "W1", spent: 200, saved: 150 },
    { label: "W2", spent: 300, saved: 220 },
    { label: "W3", spent: 250, saved: 400 },
    { label: "W4", spent: 700, saved: 300 },
];

const monthlyData = [
    { label: "Jan", spent: 800, saved: 600 },
    { label: "Feb", spent: 900, saved: 700 },
    { label: "Mar", spent: 1100, saved: 900 },
    { label: "Apr", spent: 1000, saved: 850 },
];

export default function AnalyticsUI() {
    const [mode, setMode] = useState("daily");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const getData = () => {
        if (mode === "weekly") return weeklyData;
        if (mode === "monthly") return monthlyData;
        return dailyData;
    };

    const rawData = getData();

    /* ✅ DATE FILTER */
    const currentData =
        mode === "daily"
            ? rawData.filter((item) => {
                if (!startDate || !endDate) return true;
                return (
                    new Date(item.date) >= new Date(startDate) &&
                    new Date(item.date) <= new Date(endDate)
                );
            })
            : rawData;

    /* ✅ SAFE FALLBACK */
    const safeData =
        currentData.length > 0
            ? currentData
            : [{ label: "No Data", spent: 0, saved: 0 }];

    /* ✅ TOTALS */
    const totalSpent = currentData.reduce((acc, cur) => acc + cur.spent, 0);
    const totalSaved = currentData.reduce((acc, cur) => acc + cur.saved, 0);
    const total = totalSpent + totalSaved;
    const totalRemaining = totalSaved- totalSpent;
    const donutData = [
        { name: "Spent", value: totalSpent, color: "#ef4444" }, // red
        { name: "Saved", value: totalSaved, color: "#22c55e" }, // green
        {
            name: "Remaining",
            value: totalRemaining,
            color: "#facc15", // yellow
        },
    ];

    return (
        <div className="container">
            <div className="top">
                <div className="card large">
                    <div className="card-header">
                        <h3>Spent cost & Save cost</h3>

                        <div className="tabs">
                            <span
                                className={mode === "daily" ? "active" : ""}
                                onClick={() => setMode("daily")}
                            >
                                Daily
                            </span>
                            <span
                                className={mode === "weekly" ? "active" : ""}
                                onClick={() => setMode("weekly")}
                            >
                                Weekly
                            </span>
                            <span
                                className={mode === "monthly" ? "active" : ""}
                                onClick={() => setMode("monthly")}
                            >
                                Monthly
                            </span>
                        </div>
                    </div>

                    {/* ✅ DATE FILTER UI */}
                    {mode === "daily" && (
                        <div className="date-filter">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    )}

                    {/* ✅ GRAPH */}
                    <div style={{ width: "100%", height: 200 }}>
                        <ResponsiveContainer>
                            <LineChart data={safeData}>
                                <defs>
                                    <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="pink" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid stroke="#bcc1c6" vertical={false} />
                                <XAxis dataKey="label" />
                                <YAxis hide />
                                <Tooltip />

                                <Area dataKey="spent" fill="url(#blue)" />
                                <Area dataKey="saved" fill="url(#pink)" />

                                <Line dataKey="spent" stroke="#ef4444" strokeWidth={3} />
                                <Line dataKey="saved" stroke="#22c55e" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ✅ DONUT */}
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
                        <div><span className="dot red"></span>Total Spent: ₹{totalSpent}</div>
                        <div><span className="dot green"></span> Total Saved: ₹{totalSaved}</div>
                        <div><span className="dot yellow"></span> Total Remaining: ₹{totalRemaining}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}