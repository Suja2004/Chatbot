import React, { useState } from 'react';
import './MoodForm.css'; // Assuming your CSS file is called MoodForm.css

const MoodForm = ({ updateMoodData }) => {
    const [mood, setMood] = useState('');
    const [week, setWeek] = useState('Week ');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mood && week) {
            updateMoodData(week, mood);
            setMood('');
            setWeek('Week ');
        } else {
            alert('Please fill in both fields.');
        }
    };

    return (
        <details>
            <summary>Rate your mood this week</summary>
            <div className="mood-form-container">
                <form onSubmit={handleSubmit} className="mood-form">
                    <div className="form-group">
                        <label htmlFor="week">Week:</label>
                        <input
                            type="text"
                            id="week"
                            value={week}
                            onChange={(e) => setWeek(e.target.value)}
                            placeholder="e.g., Week 1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mood">Mood:</label>
                        <input
                            type="number"
                            id="mood"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            min="1"
                            max="10"
                            placeholder="Rate from 1 to 10"
                            required
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </details>
    );
};

export default MoodForm;
