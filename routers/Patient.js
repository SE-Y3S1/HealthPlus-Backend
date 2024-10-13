const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient.js');

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Create a new patient
router.post('/', async (req, res) => {
    const { name, address, dob, contactno, email, insuranceprovider, policyno, medicalinfos } = req.body;

    // Optional: Validation check for required fields (can also be handled with middleware)
    if (!name || !address || !dob || !contactno || !email || !insuranceprovider || !policyno || !medicalinfos) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const patient = new Patient({
        name,
        address,
        dob,
        contactno,
        email,
        insuranceprovider,
        policyno,
        medicalinfos
    });

    try {
        const newPatient = await patient.save();
        res.status(201).json(newPatient); // 201: Created
    } catch (error) {
        console.log(error);
        res.status(500).send('Error: ' + error.message);
    }
});

// Update an existing patient by ID
router.put('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.name = req.body.name || patient.name;
        patient.address = req.body.address || patient.address;
        patient.dob = req.body.dob || patient.dob;
        patient.contactno = req.body.contactno || patient.contactno;
        patient.email = req.body.email || patient.email;
        patient.insuranceprovider = req.body.insuranceprovider || patient.insuranceprovider;
        patient.policyno = req.body.policyno || patient.policyno;
        patient.medicalinfos = req.body.medicalinfos || patient.medicalinfos;

        const updatedPatient = await patient.save();
        res.json(updatedPatient);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error: ' + error.message);
    }
});

// Delete a patient by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await Patient.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.send('Deleted Successfully');
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

module.exports = router;
