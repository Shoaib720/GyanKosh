const mongoose = require('mongoose');

const finesSchema = mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        daysOverDue: { type: Number, required: true },
        totalFine: { type: Number, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const chargesPerDay = 2.00; // Fine per day = ₹2.00

const fineModel = mongoose.model('Fines', finesSchema, 'fines');

module.exports = {
    fineModel,
    chargesPerDay
};