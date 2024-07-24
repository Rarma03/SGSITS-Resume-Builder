const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projects: [{
        title: { type: String },
        description: { type: String },
        technologies: { type: String },
        duration: { type: String },
        link: { type: String }
    }],
    workExperience: [{
        jobTitle: { type: String },
        company: { type: String },
        duration: { type: String },
        description: { type: String }
    }]
});

module.exports = mongoose.model('Project', projectSchema);