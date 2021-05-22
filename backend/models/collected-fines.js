const mongoose = require('mongoose');

const collectedFinesSchema = mongoose.Schema(
    {
        collectedOn: { type: Date, required: true },
        amount: { type: Number, required: true }
    },
    { versionKey: false }
);

const chargesPerDay = 2.00; // Fine per day = ₹2.00

const fineModel = mongoose.model('CollectedFines', collectedFinesSchema, 'collected-fines');

module.exports = {
    fineModel,
    chargesPerDay
};