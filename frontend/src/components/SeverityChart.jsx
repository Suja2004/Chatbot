import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SeverityChart = ({ severityHistoryArray }) => {
    const [severityData, setSeverityData] = useState([]);

    useEffect(() => {
        if (severityHistoryArray && severityHistoryArray.length > 0) {
            setSeverityData(formatData(severityHistoryArray));
        }
    }, [severityHistoryArray]);

    const formatData = (data) => {
        // Group by date and severity level
        const grouped = {};

        data.forEach((entry) => {
            const date = new Date(entry.date).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = { Mild: 0, Moderate: 0, Severe: 0 };
            }

            // Increment the corresponding severity level count
            if (entry.severityLevel === "Mild") {
                grouped[date].Mild += 1;
            } else if (entry.severityLevel === "Moderate") {
                grouped[date].Moderate += 1;
            } else if (entry.severityLevel === "Severe") {
                grouped[date].Severe += 1;
            }
        });

        // Convert grouped data into an array suitable for Recharts
        return Object.keys(grouped).map((date) => ({
            date,
            ...grouped[date],
        }));
    };

    return (
        <div className="severity-chart-container">
            <h2>Track Your Progress</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Mild" fill="#4caf50" barSize={60} />
                    <Bar dataKey="Moderate" fill="#ffc107" barSize={30} />
                    <Bar dataKey="Severe" fill="#f44336" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>

    );
};

export default SeverityChart;
