const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    positions: [{
        position: { type: String },
        duration: { type: String },
        description: { type: String }
    }],
    activities: [{
        event: { type: String },
        duration: { type: String },
        description: { type: String }
    }]
});

module.exports = mongoose.model('Position', positionSchema);
