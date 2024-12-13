import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SeverityChart from "./SeverityChart";
import './Userpage.css';
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../axiosConfig";

const UserPage = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        age: 0,
        gender: 'Male',
        frequency: 'Weekly',
        nextQuizDate: ''
    });
    const [severityHistory, setSeverityHistory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [nextQuizDate, setNextQuizDate] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            setIsFetching(true);
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');

                if (!userId || !token) {
                    handleError('User not authenticated. Please log in again.');
                    return;
                }

                const response = await axiosInstance.get(`/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { user, nextQuizDate } = response.data;
                setUserDetails(user);

                setSeverityHistory(user.severityHistory || []);
                if (nextQuizDate && nextQuizDate !== 'No previous assessments') {
                    const formattedDate = new Date(nextQuizDate).toLocaleDateString();
                    setNextQuizDate(formattedDate);

                    if (new Date(nextQuizDate).toDateString() === new Date().toDateString()) {
                        setShowPopup(true);
                    }
                } else {
                    setNextQuizDate('No previous assessments');
                    setShowPopup(true);
                }
            } catch (error) {
                handleError('Error fetching user details.');
                console.error('Fetch error:', error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUserDetails();
    }, []);

    const handleEdit = () => setIsEditing(!isEditing);

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                handleError('User is not authenticated. Please log in again.');
                return;
            }

            const response = await axiosInstance.put(
                "/user",
                userDetails,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                const updatedUser = response.data.user;
                setUserDetails(updatedUser);
                setNextQuizDate(new Date(response.data.user.nextQuizDate).toLocaleDateString());
                const [day, month, year] = nextQuizDate.split('/');

                const formattedDate = new Date(`${year}-${month}-${day}`);
                const formattedDateString = formattedDate.toLocaleDateString('en-GB');

                console.log(formattedDateString);
                if (formattedDateString === "Invalid Date") {
                    setNextQuizDate('No previous assessments');

                } else {
                    setNextQuizDate(formattedDateString);
                }
                handleError('Profile updated successfully!');

            } else {
                handleError('Failed to update profile. Please try again later.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error updating profile.';
            handleError(errorMessage);
            console.error('Profile Update Error:', error);
        } finally {
            setIsLoading(false);
            setIsEditing(false);
        }
    };

    const handleChange = (field, value) => {
        setUserDetails({
            ...userDetails,
            [field]: field === 'age' ? Number(value) : value,
        });
    };

    const handleError = (message, isError = true) => {
        setError(message);
        if (isError) {
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    const closePopup = () => setShowPopup(false);

    if (isFetching) {
        return (
            <div className="userpage-container">
                <h1 className="header">
                    <div className="left">CalmCare</div>
                    <Navbar />
                </h1>
                <div className="user-details">
                    Loading user details...
                </div>
            </div>
        );
    }

    return (
        <div className="userpage-container">
            <h1 className="header">
                <div className="left">CalmCare</div>
                <Navbar />
            </h1>
            <div className="user-details">
                <div className="user-icon">
                    <h2>
                        <FontAwesomeIcon icon={faUser} />
                    </h2>
                </div>
                {isEditing ? (
                    <div className="edit-form">
                        <label>
                            Name:
                            <input
                                type="text"
                                value={userDetails.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                                readOnly
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={userDetails.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                readOnly
                            />
                        </label>
                        <label>
                            Age:
                            <input
                                type="number"
                                value={userDetails.age}
                                onChange={(e) => handleChange("age", e.target.value)}
                            />
                        </label>
                        <label>
                            Gender:
                            <select
                                value={userDetails.gender}
                                onChange={(e) => handleChange("gender", e.target.value)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        <label>
                            Assessment Frequency:
                            <select
                                value={userDetails.frequency}
                                onChange={(e) => handleChange("frequency", e.target.value)}
                            >
                                <option value="Weekly">Weekly</option>
                                <option value="Bi-Weekly">Bi-Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </label>
                        <button className="save-button" onClick={handleSave} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                ) : (
                    <div className="details-display">
                        <p>Name: {userDetails.username}</p>
                        <p>Email: {userDetails.email}</p>
                        <p>Age: {userDetails.age}</p>
                        <p>Gender: {userDetails.gender}</p>
                        <p>Assessment Frequency: {userDetails.frequency}</p>
                        <p>Next Assessment Date: {nextQuizDate}
                            {nextQuizDate === 'No previous assessments'
                                ? <Link className="link" to="/severity">
                                    <button className="attempt-button">Attempt</button>
                                </Link> : ""}
                        </p>

                        <button className="edit-button" onClick={handleEdit}>
                            Edit
                        </button>
                    </div>
                )}
                <div className="chart-container">
                    {severityHistory.length > 0 ? (
                        <SeverityChart severityHistoryArray={severityHistory} />
                    ) : (
                        <div className="user-details">No severity history available.</div>
                    )}
                </div>
            </div>
            {error && (
                <>
                    <div className="popup-overlay"></div>
                    <div className="popup">
                        <p>{error}</p>
                        <div className="popup-buttons">
                            <button onClick={() => setError('')}>Close</button>
                        </div>
                    </div>
                </>
            )}

            {showPopup && (
                <div className="popup">
                    <p>
                        {nextQuizDate === 'No previous assessments'
                            ? "You haven't taken an assessment yet. Would you like to take one now?"
                            : "It's time for your next assessment. Would you like to proceed?"}
                    </p>
                    <div className="popup-buttons">
                        <Link className="link" to="/severity">
                            <button>Yes</button>
                        </Link>
                        <button onClick={closePopup}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
