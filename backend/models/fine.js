const mongoose = require('mongoose');

const fineRecordSchema = mongoose.Schema(
    {
        collectedOn: { type: Date, required: true },
        amount: { type: Number, required: true }
    },
    { versionKey: false }
);

module.exports = mongoose.model('FineRecord', fineRecordSchema, 'fine-records');