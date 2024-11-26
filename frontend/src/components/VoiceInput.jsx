import React, { useState } from "react";
import SpeechRecognition from "./Speechtest";

const VoiceInput = () => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            console.log("Recognized Speech:", spokenText);
            setTranscript(spokenText);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            alert("An error occurred during speech recognition: " + event.error);
        };

        recognition.onend = () => {
            console.log("Speech recognition stopped.");
            setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
    };

    return (
        <div>
            <h3>Voice Input</h3>
            <button onClick={startListening} disabled={isListening}>
                {isListening ? "Listening..." : "Start Voice Input"}
            </button>
            <p>Transcript: {transcript}</p>
        </div>
    );
};

export default VoiceInput;
