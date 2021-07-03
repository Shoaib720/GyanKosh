const mongoose = require('mongoose');

const bookItemSchema = mongoose.Schema(
    {
        barcode: { type: String, required: true },
        isbnNo: { type: String, required: true },
        isReferenceOnly: { type: Boolean, required: true },
        price: { type: Number, required: true },
        format: {
            type: String,
            enum:['HARDCOVER', 'PAPERBACK', 'AUDIOBOOK', 'MAGAZINE', 'EBOOK', 'NEWSPAPER', 'JOURNAL'],
            required: true
        },
        status: {
            type: String,
            enum:['AVAILABLE', 'RESERVED', 'BORROWED', 'LOST'],
            required: true
        },
        dateOfPurchase: { type: Date, required: true },
        publicationDate: { type: Date, required: true },
        borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        borrowedOn: { type: Date, default: null },
        dueOn: { type: Date, default: null },
        imageURL: { type: String, required: true }

    }
);