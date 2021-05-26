const LibraryCard = require('../models/library-card');
const CollectedFines = require('../models/fine');

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

const getCardById = (req, res, next) => {
    LibraryCard.findById({ _id: req.params.id })
    .then(card => {
        res.status(200).json({
            message: 'SUCCESS',
            data: card
        });
    })
    .catch(_ => {
        res.status(404).json({
            message: 'NOT_FOUND'
        });
    });
}

const createLibraryCard = (cardHolderDetails) => {
    var card = new LibraryCard({
        cardHolderId: cardHolderDetails.id,
        cardHolderName: cardHolderDetails.name
    });
    card.save()
    .then(createdCard => { return createdCard._id })
    .catch(err => {
        res.status(500).json({
            message: 'INTERNAL_SERVER_ERROR',
            error: err
        });
    })
}

const deleteLibraryCard = (cardId) => {
    LibraryCard.findByIdAndDelete({ _id: cardId })
    .then(_ => { return true })
    .catch(_ => { return false });
}

module.exports = {
    isIssuable,
    enterBookIssuingDetails,
    generateFine,
    getCardById,
    createLibraryCard,
    deleteLibraryCard
}