import React, { useState } from "react";
import axios from "axios";
import './Severity.css';
import Navbar from "./Navbar";
import axiosInstance from "../axiosConfig";

const Severity = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState([]);
    const [severity, setSeverity] = useState(null);
    const [error, setError] = useState(null);
    const [severityLevel, setSeverityLevel] = useState(null);

    const questions = [
        "How often have you experienced unwanted or disturbing memories of a traumatic event?",
        "How much have upsetting dreams related to a traumatic event affected your sleep?",
        "How frequently have you felt upset or distressed when reminded of a traumatic event?",
        "How often have you avoided memories, thoughts, or feelings about a traumatic event?",
        "How often have you avoided people, places, or situations that remind you of a traumatic event?",
        "How much difficulty have you had experiencing positive emotions or feeling emotionally numb?",
        "How often have you felt overly alert or on edge, as if something bad might happen?",
        "How much trouble have you had concentrating due to thoughts about a traumatic event?",
        "How frequently have you felt irritable or had outbursts of anger without clear reason?",
        "How often have you experienced physical symptoms (like sweating or a racing heart) when reminded of a traumatic event?"
    ];

    const handleResponse = (value) => {
        const updatedResponses = [...responses];
        updatedResponses[currentQuestionIndex] = value;
        setResponses(updatedResponses);
        setError(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (responses.includes(null)) {
            setError("Please answer all questions before submitting.");
            return;
        }

        try {
            const totalScore = responses.reduce((acc, val) => acc + val, 0);
            setSeverity(totalScore);

            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            const response = await axios.post("https://severityserver.onrender.com/predict", {
                responses: responses,
            });

            const predictedSeverityLevel = response.data.severity;
            setSeverityLevel(predictedSeverityLevel);

            await axiosInstance.post(`/user/${userId}/severity`, {
                severityScore: totalScore,
                severityLevel: predictedSeverityLevel,
            }, {
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
                <div className="left">CalmCare</div>
                <Navbar />
            </h1>
            {severity !== null ? (
                <div className="severity-result">
                    <h2>Predicted Severity: {severityLevel}</h2>
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
                    <h3>{Math.round(severity)}%</h3>

                    <div className="severity-description">
                        {severityLevel === "Mild" && (
                            <div className="mild">
                                <p><strong>Description:</strong> Your symptoms suggest a mild level of distress. You may experience occasional intrusive thoughts or mild discomfort related to past trauma, but it is manageable in daily life.</p>
                                <p><strong>Suggestions:</strong> Consider engaging in relaxation techniques, such as mindfulness or deep breathing exercises. It may also be helpful to talk to a counselor or therapist to monitor your well-being.</p>
                            </div>
                        )}

                        {severityLevel === "Moderate" && (
                            <div className="moderate">
                                <p><strong>Description:</strong> Your symptoms suggest a moderate level of distress. You may experience frequent emotional or physical reactions when reminded of traumatic events, affecting your daily activities.</p>
                                <p><strong>Suggestions:</strong> It may be beneficial to explore therapy options like cognitive behavioral therapy (CBT). Additionally, engaging in self-care practices and seeking support from close friends or support groups can be helpful.</p>
                            </div>
                        )}

                        {severityLevel === "Severe" && (
                            <div className="severe">
                                <p><strong>Description:</strong> Your symptoms suggest a severe level of distress. It is likely that intrusive memories and emotional reactions significantly interfere with your daily life.</p>
                                <p><strong>Suggestions:</strong> Seeking professional mental health support is strongly recommended. Therapy, such as trauma-focused therapy, and possible medical intervention could provide substantial relief. It's important to reach out to a healthcare provider to discuss your treatment options.</p>
                            </div>
                        )}
                    </div>
                </div>

            ) : (
                <div className="severity-content">
                    <p>Question {currentQuestionIndex + 1}/{questions.length}:</p>
                    <p>{questions[currentQuestionIndex]}</p>
                    <div className="response-options">
                        {[1, 3, 6, 8, 10].map((score, index) => (
                            <button
                                key={score}
                                onClick={() => handleResponse(score)}
                                className={`response-button ${responses[currentQuestionIndex] === score ? "selected" : "hi"
                                    }`}
                            >
                                {["Not at all", "Rarely", "Sometimes", "Often", "Very often"][index]}
                            </button>
                        ))}
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
                            <button
                                onClick={() => handleResponse(responses[currentQuestionIndex])}
                                className="next-button"
                                disabled={responses[currentQuestionIndex] === null}
                            >
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
