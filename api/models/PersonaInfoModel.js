const mongoose = require('mongoose');

const personaInfoSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String },
    lastName: { type: String },
    dob: { type: String },
    gender: { type: String },
    branch: { type: String },
    enrollmentNo: { type: String },
    year: { type: String },
    email: { type: String },
    phone: { type: String }
});

module.exports = mongoose.model('PersonaInfo', personaInfoSchema);
