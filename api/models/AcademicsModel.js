const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const academicsSchema = new Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tenth: {
        percentage: { type: String },
        school: { type: String },
        board: { type: String },
        passOutYear: { type: String }
    },
    twelfth: {
        percentage: { type: String },
        school: { type: String },
        board: { type: String },
        passOutYear: { type: String },
        is12th: { type: Boolean, default: false },
        isDiploma: { type: Boolean, default: false }
    },
    graduation: {
        percentage: { type: String },
        college: { type: String },
        university: { type: String },
        passOutYear: { type: String }
    },
    scholasticAchievement: { type: String } // Added field
});

module.exports = mongoose.model('Academics', academicsSchema);
