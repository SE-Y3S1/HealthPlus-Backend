const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Patient = require('../models/Patient'); // Your Mongoose model
const PatientRouter = require('../routers/Patient.js'); // Your router

const app = express();
app.use(express.json());
app.use('/patients', PatientRouter);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Patient.deleteMany(); // Clear data before each test
});

describe('Patient API', () => {
    it('should create a new patient (Positive Test)', async () => {
        const newPatient = { 
            name: 'John Doe', 
            age: 30, 
            disease: 'Flu', 
            nic: '123456789V',
            email: 'john@example.com',
            contactno: '0771234567',
            dob: '1993-05-20',
            address: '123 Main Street' 
        };

        const res = await request(app)
            .post('/patients')
            .send(newPatient)
            .expect(201); // Assert: Status 201 for created

        expect(res.body).toHaveProperty('_id'); // Assert: ID exists
        expect(res.body.name).toBe('John Doe'); // Assert: Name is correct
    });

    it('should get all patients (Positive Test)', async () => {
        await Patient.create({ 
            name: 'Alice', 
            age: 25, 
            disease: 'Cold', 
            nic: '987654321V', 
            email: 'alice@example.com', 
            contactno: '0777654321', 
            dob: '1999-10-10', 
            address: '456 Another Street' 
        });

        const res = await request(app)
            .get('/patients')
            .expect(200); // Assert: Status 200

        expect(res.body.length).toBe(1); // Assert: One patient in DB
        expect(res.body[0].name).toBe('Alice'); // Assert: Name matches
    });

    it('should return 404 for non-existent patient deletion (Negative Test)', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Generate fake ID

        const res = await request(app)
            .delete(`/patients/${nonExistentId}`)
            .expect(404); // Assert: Status 404 for non-existent resource

        expect(res.body).toHaveProperty('message', 'Patient not found'); // Assert: Message matches
    });
});
