const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    stuentRegistrationNumber: String,
    studentId: String,
    studentName: String,
    fatherGuardianName: String,
    class: String,
    emergencyContact: Number,
    studentProfileImageUrl: String,
})

const Student = mongoose.model("Student", StudnetSchema)

module.exports = Student