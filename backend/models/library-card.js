const mongoose = require('mongoose');

const libraryCardSchema = mongoose.Schema(
    {
        cardHolder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bookRecord: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'BookRecord',
                validate: [issueLimit, 'Maximum book issue limit is reached']
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const issueLimit = bookRecord => {
    if(!bookRecord) return false;
    if(bookRecord.length > 5) return false;
    else return true;
}

module.exports = LibraryCard = mongoose.model('LibraryCard', libraryCardSchema, 'library-cards');
