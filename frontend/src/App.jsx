import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import Severity from "./components/Severity";
import UserPage from "./components/Userpage";
import Therapy from "./components/Therapy";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import './App.css';
import axios from "axios";

const App = () => {
    useEffect(() => {
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    alert('Session expired. Please log in again.');
                    window.location.href = '/';
                }
                return Promise.reject(error);
            }
        );
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/severity" element={<Severity />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/therapy" element={<Therapy />} />

                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;
