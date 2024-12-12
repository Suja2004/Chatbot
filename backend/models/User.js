const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, sparse: true, default: null },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    frequency: { type: String, enum: ["Weekly", "Bi-Weekly", "Monthly"], default: "Weekly" },
    severityHistory: [
        {
            date: { type: Date, default: Date.now },
            severityScore: { type: Number, required: true },
            severityLevel: { type: String, required: true }, 
        },
    ],
});

module.exports = mongoose.model('User', userSchema);
