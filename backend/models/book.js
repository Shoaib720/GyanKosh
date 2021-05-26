const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        authors: { type: [String], required: true },
        category: { type: String, required: true },
        publicationDate: { type: Date, required: true },
        rack: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rack',
            required: true
        },
        isIssued: { type: Boolean, default: false },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        checkedOutBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        coverImageURL: { type: String }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Book', bookSchema, 'books');