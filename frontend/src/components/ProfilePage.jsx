import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import MoodChart from './MoodChart';
import MoodForm from './MoodForm';

const ProfilePage = () => {
    const [patientDetails, setPatientDetails] = useState({
        name: '',
        age: '',
        gender: '',
        diagnosis: '',
        treatment: '',
        lastVisit: '',
        notes: ''
    });
    const [moodData, setMoodData] = useState({
        'Week 1': 6,
        'Week 2': 7,
        'Week 3': 8,
        'Week 4': 6,
        'Week 5': 9,
    });
    useEffect(() => {
        const fetchPatientData = () => {
            setPatientDetails({
                name: 'Rajesh',
                age: '30',
                gender: 'Male',
                diagnosis: 'PTSD'
            });
        };

        fetchPatientData();
    }, []);
    const updateMoodData = (week, mood) => {
        setMoodData((prevMoodData) => ({
            ...prevMoodData,
            [week]: parseInt(mood),
        }));
    };
    return (
        <div className="profile-container">
            <h1>Patient Details</h1>

            <div className="profile-detail">
                <div><strong>Name:</strong> {patientDetails.name}</div>
                <div><strong>Age:</strong> {patientDetails.age}</div>
                <div><strong>Gender:</strong> {patientDetails.gender}</div>
            </div>
            <div className="mood">
                <MoodForm updateMoodData={updateMoodData} />
                <MoodChart moodData={moodData} />
            </div>
        </div>
    );
};

export default ProfilePage;
