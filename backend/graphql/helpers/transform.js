const { singleRack, singleUser, singleBook, singleLibraryCard, bookRecords } = require('./merge');

const transformBook = (book, req) => {
    return {
        ...book._doc,
        publicationDate: dateToString(book._doc.publicationDate),
        rack: singleRack.bind(this, book._doc.rack),
        issuedBy: singleUser.bind(this, book._doc.issuedBy),
        checkedOutBy: singleUser.bind(this, book._doc.checkedOutBy),
        coverImageURL: req.protocol + '://' + req.get('host') + '/' + book._doc.coverImageURL,
        createdAt: dateToString(book._doc.createdAt),
        updatedAt: dateToString(book._doc.updatedAt)
    };
}

const transformBookRecord = bookRecord => {
    return {
        ...bookRecord._doc,
        book: singleBook.bind(this, bookRecord._doc.book),
        issuedOn: dateToString(bookRecord._doc.issuedOn),
        dueOn: dateToString(bookRecord._doc.dueOn),
        createdAt: dateToString(bookRecord._doc.createdAt),
        updatedAt: dateToString(bookRecord._doc.updatedAt)
    };
}

const transformUser = user => {
    return {
        ...user._doc,
        card: singleLibraryCard.bind(this, user._doc.card),
        createdAt: dateToString(user._doc.createdAt),
        updatedAt: dateToString(user._doc.updatedAt)
    }
}

const transformLibraryCard = card => {
    return {
        ...card._doc,
        cardHolder: singleUser.bind(this, card._doc.cardHolder),
        bookRecord: bookRecords.bind(this, card._doc.bookRecord),
        createdAt: dateToString(card._doc.createdAt),
        updatedAt: dateToString(card._doc.updatedAt)
    }
}

exports.transformBook = transformBook;
exports.transformBookRecord = transformBookRecord;
exports.transformLibraryCard = transformLibraryCard;
exports.transformUser = transformUser;