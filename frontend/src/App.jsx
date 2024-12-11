import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import Severity from "./components/Severity";
import UserPage from "./components/Userpage";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import './App.css';
import axios from "axios";

const App = () => {
    useEffect(() => {
        // Set up Axios interceptor for handling token expiration
        axios.interceptors.response.use(
            (response) => response, // Pass through successful responses
            (error) => {
                if (error.response && error.response.status === 401) {
                    alert('Session expired. Please log in again.');
                    window.location.href = '/'; // Redirect to login page
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
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;
