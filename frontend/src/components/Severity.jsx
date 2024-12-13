import React, { useState } from "react";
import axios from "axios";
import './Severity.css';
import Navbar from "./Navbar";
import axiosInstance from "../axiosConfig";

const Severity = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(Array(10));
    const [severity, setSeverity] = useState(null);
    const [error, setError] = useState(null);
    const [severityLevel, setSeverityLevel] = useState(null);
    const questions = [
        "On a scale of 1 to 10, how severe are unwanted or disturbing memories of a traumatic event?",
        "On a scale of 1 to 10, how severe are upsetting dreams related to a traumatic event?",
        "On a scale of 1 to 10, how severe is your emotional distress when reminded of a traumatic event?",
        "On a scale of 1 to 10, how severe is your urge to avoid memories, thoughts, or feelings about a traumatic event?",
        "On a scale of 1 to 10, how severe is your urge to avoid external reminders (people, places, conversations) about a traumatic event?",
        "On a scale of 1 to 10, how severe is your emotional numbness or inability to experience positive emotions?",
        "On a scale of 1 to 10, how severe is your feeling of being overly alert or on edge, as if something bad might happen?",
        "On a scale of 1 to 10, how severe is your difficulty concentrating due to thoughts about a traumatic event?",
        "On a scale of 1 to 10, how severe is your irritability or anger without clear reason?",
        "On a scale of 1 to 10, how severe are your physical reactions (sweating, heart racing) when reminded of a traumatic event?",
    ];

    const handleResponseChange = (value) => {
        const updatedResponses = [...responses];
        updatedResponses[currentQuestionIndex] = parseInt(value, 10);
        setResponses(updatedResponses);
        setError("");
    };

    const handleNext = () => {
        if (!responses[currentQuestionIndex]) {
            setError("Please provide an answer before proceeding.");
            return;
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        setError(null);
        if (!responses[currentQuestionIndex]) {
            setError("Please provide an answer before submitting.");
            return;
        }
        try {
            const totalScore = responses.reduce((acc, val) => acc + val, 0);
            setSeverity(totalScore);
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            const response = await axios.post("http://localhost:3000/predict", {
                responses: responses,
            });
            const predictedSeverityLevel = response.data.severity;
            setSeverityLevel(predictedSeverityLevel);

            await axiosInstance.post(`/user/${userId}/severity`, {
                severityScore: totalScore,
                severityLevel: predictedSeverityLevel,
            },
                {
                    headers: { Authorization: `Bearer ${token}` },
                });
        } catch (err) {
            setError("An error occurred while calculating severity. Please try again.");
        }
    };

    const pointerRotation = severity ? (severity / 100 * 180) + (-90) : 0;

    return (
        <div className="severity-container">
            <h1 className="header">
                <div className="left">
                    CalmCare
                </div>
                <Navbar />
            </h1>
            {severity !== null ? (
                <div className="severity-result">
                    <h2>Predicted Severity: {severityLevel} </h2>
                    <div className="semicircle-meter">
                        <div className="labels">
                            <span>Mild</span>
                            <span>Moderate</span>
                            <span>Severe</span>
                        </div>
                        <div className="meter">
                            <div
                                className="pointer"
                                style={{ transform: `rotate(${pointerRotation}deg)` }}
                            ></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="severity-content question">
                    <p>
                        Question {currentQuestionIndex + 1}/{questions.length}:
                    </p>
                    <p>{questions[currentQuestionIndex]}</p>
                    <div className="response">
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={responses[currentQuestionIndex] || ""}
                            onChange={(e) => handleResponseChange(e.target.value)}
                            placeholder="1 - 10"
                            required
                        />
                    </div>
                    <div className="navigation-buttons">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="prev-button"
                        >
                            Previous
                        </button>
                        {currentQuestionIndex === questions.length - 1 ? (
                            <button onClick={handleSubmit} className="submit-button">
                                Submit
                            </button>
                        ) : (
                            <button onClick={handleNext} className="next-button">
                                Next
                            </button>
                        )}
                    </div>
                    {error && <p className="error">{error}</p>}

                </div>
            )}
        </div>
    );
};

export default Severity;