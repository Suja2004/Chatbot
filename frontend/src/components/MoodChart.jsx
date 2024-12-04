import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MoodChart = ({ moodData }) => {
    const data = {
        labels: Object.keys(moodData),
        datasets: [
            {
                label: 'Mood Progress',
                data: Object.values(moodData),
                borderColor: '#33ccffb4',
                backgroundColor: '#33ccffb4',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#3cf',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Patient Mood Progress',
                font: { size: 18 },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Weeks',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Mood Rating (1-10)',
                },
                suggestedMin: 0,
                suggestedMax: 10,
            },
        },
    };

    return (
        <div className="chart-container">
            <Line data={data} options={options} />
        </div>
    );
};

export default MoodChart;
