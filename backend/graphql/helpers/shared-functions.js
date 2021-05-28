const LibraryCard = require('../../models/library-card');

const isIssuable = (cardId) => {
    LibraryCard.findById({ _id: cardId })
    .then(card => {
        if(card.bookRecord.length < 5) return true;
        else return false;
    })
    .catch(_ => {
        res.status(404).json({
            message: 'LIBRARY_CARD_NOT_FOUND',
        })
    })
}