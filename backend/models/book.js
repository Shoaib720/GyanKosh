const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        authors: { type: [String], required: true },
        category: { type: String, required: true },
        language: { type: String, required: true },
        printLength: { type: Number, required: true },
        bookItems: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BookItem'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Book', bookSchema, 'books');