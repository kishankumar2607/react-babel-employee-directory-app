const mongoose = require("mongoose");

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
        type: String,
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
        type: Number,
        default: 1
    },
});

module.exports = mongoose.model("Employee", employeeSchema);
