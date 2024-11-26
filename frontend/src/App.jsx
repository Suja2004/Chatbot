import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import VoiceInput from "./components/VoiceInput";
import './App.css';
const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Chatbot />} />
            <Route path="/test" element={<VoiceInput />} />
        </Routes>
    </Router>
);

export default App;
