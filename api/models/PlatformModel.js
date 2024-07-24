const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const platformSchema = new Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    operatingSystems: [String],
    programmingSkills: [String],
    webDesigningSkills: [String],
    softwareSkills: [String],
    courses: {
        core: [String],
        depth: [String]
    }
});

module.exports = mongoose.model('Platform', platformSchema);
