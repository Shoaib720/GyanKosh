const mongoose = require('mongoose');

const libraryCardSchema = mongoose.Schema(
    {
        cardHolderId: { type: mongoose.Schema.Types.ObjectId, required: true },
        cardHolderName: { type: String, required: true },
        bookRecord: [
            {
                bookId: { type: mongoose.Schema.Types.ObjectId, required: true },
                title: { type: String, required: true },
                issuedOn: { type: Date, required: true },
                dueOn: { type: Date, required: true }
            },
        ],
        
    }
);

libraryCardSchema.path('bookRecord').validate(
    (bookRecord) => {
        if(!bookRecord) return false;
        if(bookRecord.length > 5) return false;
        else return true;
    },
    'Maximum book issue limit is reached'
);

module.exports = LibraryCard = mongoose.model('LibraryCard', libraryCardSchema, 'library-cards');
