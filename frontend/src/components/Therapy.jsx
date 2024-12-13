import React, { useState, useEffect } from "react";
import './Therapy.css';
import Navbar from "./Navbar";
import sessionData from './sessions.json';

const Therapy = () => {
    const [therapyScript, setTherapyScript] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeSessionIndex, setActiveSessionIndex] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [currentUtteranceIndex, setCurrentUtteranceIndex] = useState(0);
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            setVoices(allVoices);
        };

        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        } else {
            loadVoices();
        }
    }, []);

    const therapySessions = sessionData.sessions;

    const handleStart = (session, index) => {
        setTherapyScript(session.script);
        setActiveSessionIndex(index);
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentUtteranceIndex(0);
        speakText(session.script);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setActiveSessionIndex(null);
        setIsPaused(false);
    };

    const handlePauseResume = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        } else {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const speakText = (text) => {
        const steps = text.split("\n");

        let delay = 0;

        steps.forEach((step, index) => {
            delay += 5000;

            setTimeout(() => {
                if (index < currentUtteranceIndex) return;

                const utterance = new SpeechSynthesisUtterance(step.trim());
                const selectedVoice = voices.find(voice => voice.name === "Google US English") || voices[0];

                utterance.voice = selectedVoice;
                utterance.lang = "en-US";
                utterance.pitch = 3;
                utterance.rate = 0.75;
                utterance.volume = 0.8;

                utterance.onstart = () => {
                    setIsSpeaking(true);
                    setCurrentUtteranceIndex(index);
                };

                utterance.onend = () => {
                    if (index === steps.length - 1) {
                        setIsSpeaking(false);
                    }
                };

                window.speechSynthesis.speak(utterance);
            }, delay);
        });
    };

    const groupedSessions = {
        severe: therapySessions.filter(session => session.severity === "severe"),
        moderate: therapySessions.filter(session => session.severity === "moderate"),
        mild: therapySessions.filter(session => session.severity === "mild")
    };

    return (
        <div className="container">
            <div className="header">
                <div className="left">
                    CalmCare
                </div>
                <Navbar />
            </div>
            <h1>PTSD Therapy Sessions</h1>
            <div className="severity-group">

                <div className="severity">
                    <h2>Mild Severity</h2>
                    <div className="list">
                        {groupedSessions.mild.map((session, index) => (
                            <div key={index} className="card">
                                <h3>{session.title}</h3>
                                <p>{session.description}</p>
                                <div className="button-group">
                                    <button
                                        onClick={() => handleStart(session, index)}
                                        disabled={isSpeaking || activeSessionIndex === index}
                                    >
                                        {isSpeaking && activeSessionIndex === index ? "Speaking..." : "Play Audio"}
                                    </button>
                                    <button
                                        onClick={handlePauseResume}
                                        disabled={!isSpeaking || activeSessionIndex !== index}
                                    >
                                        {isPaused ? "Resume" : "Pause"}
                                    </button>
                                    <button
                                        onClick={handleStop}
                                        disabled={!isSpeaking || activeSessionIndex !== index}
                                    >
                                        Stop
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="severity">
                    <h2>Moderate Severity</h2>
                    <div className="list">
                        {groupedSessions.moderate.map((session, index) => (
                            <div key={index} className="card">
                                <h3>{session.title}</h3>
                                <p>{session.description}</p>
                                <div className="button-group">
                                    <button
                                        onClick={() => handleStart(session, index)}
                                        disabled={isSpeaking || activeSessionIndex === index}
                                    >
                                        {isSpeaking && activeSessionIndex === index ? "Speaking..." : "Play Audio"}
                                    </button>
                                    <button
                                        onClick={handlePauseResume}
                                        disabled={!isSpeaking || activeSessionIndex !== index}
                                    >
                                        {isPaused ? "Resume" : "Pause"}
                                    </button>
                                    <button
                                        onClick={handleStop}
                                        disabled={!isSpeaking || activeSessionIndex !== index}
                                    >
                                        Stop
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="severity">
                    <h2>Severe Severity</h2>
                    <div className="list">
                        {groupedSessions.severe.map((session, index) => (
                            <div key={index} className="card">
                                <h3>{session.title}</h3>
                                <p>{session.description}</p>
                                <div className="button-group">
                                    <button
                                        onClick={() => handleStart(session, index)}
                                        disabled={isSpeaking || activeSessionIndex === index}
                                    >
                                        {isSpeaking && activeSessionIndex === index ? "Speaking..." : "Play Audio"}
                                    </button>
                                    <button
                                        onClick={handlePauseResume}
                                        disabled={!isSpeaking || activeSessionIndex !== index}
                                    >
                                        {isPaused ? "Resume" : "Pause"}
                                    </button>
                                    <button
                                        onClick={handleStop}
                                        disabled={!isSpeaking || activeSessionIndex !== index}
                                    >
                                        Stop
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Therapy;