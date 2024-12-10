import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import './App.css';
const App = () => (
    <Router>
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/" element={<Login />} />
        </Routes>
    </Router>
);

export default App;
