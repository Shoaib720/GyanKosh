const LibraryCard = require('../models/library-card');
const CollectedFines = require('../models/collected-fines');

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

const enterBookIssuingDetails = (issuingDetails) => {
    const bookRecord = {
        bookId: issuingDetails.bookId,
        title: issuingDetails.title,
        issuedOn: issuingDetails.issuedOn,
        dueOn: issuingDetails.dueOn
    }
    LibraryCard.findByIdAndUpdate(
        { _id: issuingDetails.cardId },
        {
            $set: {
                $push: {
                    bookRecord: bookRecord
                }
            }
        },
        { new: true }
    )
    .then(updatedCard => {
        return updatedCard
    })
    .catch(_ => {
        res.status(404).json({
            message: 'LIBRARY_CARD_NOT_FOUND',
        })
    })
}

const generateFine = (cardId) => {
    LibraryCard.findById({ _id: cardId })
    .then(card => {
        if(card.dueOn <= new Date()) return 0;
        else{
            const difference = card.dueOn.getTime() - card.issuedOn.getTime();
            const dueDays = Math.ceil(difference/(24 * 60 * 60 * 1000)); // divide ms by the number of ms in one day
            return CollectedFines.chargesPerDay * dueDays;
        }
    })
    .catch(_ => {
        res.status(404).json({
            message: 'LIBRARY_CARD_NOT_FOUND',
        })
    })
}

module.exports = {
    isIssuable,
    enterBookIssuingDetails,
    generateFine
}