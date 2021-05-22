const mongoose = require('mongoose');

const rackSchema = mongoose.Schema(
    {
        rackNumber: { type: Number, required: true },
        category: { type: String, required: true }
    },
    { versionKey: false }
);

module.exports = mongoose.model('Rack', rackSchema, 'racks');