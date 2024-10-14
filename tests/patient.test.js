const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();

const PatientRouter = require('../routers/Patient.js');
app.use(express.json());
app.use('/patients', PatientRouter);

const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB before tests
beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up before each test
beforeEach(async () => {
    await mongoose.connection.collection('patients').deleteMany({});
});

// Close the connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// Test cases
describe('Patient API', () => {
    // Test GET all patients
    test('should get all patients (positive test)', async () => {
        const res = await request(app).get('/patients');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]); // Expecting an empty array
    });

    // Test POST create patient
    test('should create a new patient (positive test)', async () => {
        const newPatient = {
            name: "John Doe",
            address: "123 Main St",
            dob: "1990-01-01",
            contactno: "1234567890",
            email: "john@example.com",
            insuranceprovider: "Health Inc.",
            policyno: "ABC123456",
            medicalinfos: "No allergies"
        };

        const res = await request(app).post('/patients').send(newPatient);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe(newPatient.name);
    });

    // Test POST create patient with missing fields (negative test)
    test('should return error for missing required fields (negative test)', async () => {
        const newPatient = {
            name: "Jane Doe",
            // Missing required fields
        };

        const res = await request(app).post('/patients').send(newPatient);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'All fields are required');
    });

    // Test GET patient by ID (positive test)
    test('should get a patient by ID (positive test)', async () => {
        const newPatient = {
            name: "Alice Smith",
            address: "456 Elm St",
            dob: "1995-05-15",
            contactno: "9876543210",
            email: "alice@example.com",
            insuranceprovider: "CarePlus",
            policyno: "XYZ987654",
            medicalinfos: "No pre-existing conditions"
        };

        const patientResponse = await request(app).post('/patients').send(newPatient);
        const patientId = patientResponse.body._id;

        const res = await request(app).get(`/patients/${patientId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', patientId);
        expect(res.body.name).toBe(newPatient.name);
    });

    // Test GET patient by non-existent ID (negative test)
    test('should return error for non-existent patient (negative test)', async () => {
        const res = await request(app).get('/patients/60c72b2f9b1e8a001c8f66d1'); // Invalid ID
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Patient not found');
    });
});
