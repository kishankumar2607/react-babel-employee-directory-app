const mongoose = require("mongoose");

// Define the schema for the Employee model
const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 20,
        max: 70
    },
    dateOfJoining: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        enum: ["Employee", "Manager", "Director", "VP"]
    },
    department: {
        type: String,
        enum: ["IT", "Marketing", "HR", "Engineering"]
    },
    employeeType: {
        type: String,
        enum: ["FullTime", "PartTime", "Contract", "Seasonal"],
        required: true
    },
    currentStatus: {
        type: Boolean,
        default: 1
    },
});

module.exports = mongoose.model("Employee", employeeSchema);
