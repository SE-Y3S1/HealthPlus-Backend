const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dob: {
        type: Date,  // Changed from String to Date
        required: true
    },
    contactno: {
        type: String,  // Changed from Number to String
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Basic regex for email validation
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    nic: {
        type: String,  // Changed from Number to String
        required: true
    },
    insuranceprovider: {
        type: String,
        required: false
    },
    policyno: {
        type: String,
        required: false
    },
    medicalinfos: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("Patient", PatientSchema);
