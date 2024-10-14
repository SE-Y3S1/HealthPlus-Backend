// __mocks__/mongoose.js
const mongoose = jest.createMockFromModule('mongoose');

const mockPatients = [];

const mockModel = {
    find: jest.fn(() => Promise.resolve(mockPatients)),
    findById: jest.fn((id) => Promise.resolve(mockPatients.find(patient => patient._id === id))),
    create: jest.fn((patient) => {
        const newPatient = { ...patient, _id: 'mocked_id' };
        mockPatients.push(newPatient);
        return Promise.resolve(newPatient);
    }),
    deleteOne: jest.fn(({ _id }) => {
        const index = mockPatients.findIndex(patient => patient._id === _id);
        if (index !== -1) {
            mockPatients.splice(index, 1);
            return Promise.resolve({ deletedCount: 1 });
        }
        return Promise.resolve({ deletedCount: 0 });
    }),
};

mongoose.model = jest.fn((modelName) => {
    if (modelName === 'Patient') {
        return mockModel;
    }
    throw new Error(`Model not mocked: ${modelName}`);
});

module.exports = mongoose;
