const mongoose = require('mongoose');

const bookRecordSchema = mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        issuedOn: { type: Date, required: true },
        dueOn: { type: Date, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('BookRecord', bookRecordSchema, 'book-records');