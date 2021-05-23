const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        authors: { type: [String], required: true },
        category: { type: String, required: true },
        keywords: { type: [String], required: true },
        publicationDate: { type: Date, required: true },
        rackNumber: { type: Number, required: true },
        isIssued: { type: Boolean, default: false },
        issuedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
        checkedOutBy: { type: mongoose.Schema.Types.ObjectId, default: null },
        coverImageURL: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Book', bookSchema, 'books');