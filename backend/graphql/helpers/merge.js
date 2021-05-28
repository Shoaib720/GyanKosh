const Rack = require('../../models/rack');
const User = require('../../models/user');
const Card = require('../../models/library-card');
const BookRecord = require('../../models/book-record');
const Book = require('../../models/book');
const { dateToString } = require('./dates-helper');

const singleRack = async rackId => {
    try{
        const rack = await Rack.findById(rackId);
        return rack;
    } catch(err) {
        throw err;
    }
}

const singleLibraryCard = async cardId => {
    try{
        const card = await Card.findById(cardId);
        return {
            ...card._doc,
            cardHolder: singleUser.bind(this, card._doc.cardHolder),
            bookRecord: bookRecords.bind(this, card._doc.bookRecord),
            createdAt: dateToString(card._doc.createdAt),
            updatedAt: dateToString(card._doc.updatedAt)
        };
    } catch(err) {
        throw err;
    }
}

const singleUser = async userId => {
    try{
        const user = await User.findById(userId);
        return {
            ...user._doc,
            card: singleLibraryCard.bind(this, user._doc.card),
            createdAt: dateToString(user._doc.createdAt),
            updatedAt: dateToString(user._doc.updatedAt)
        }
    } catch(err){
        throw err;
    }
}

const singleBookRecord = async bookRecordId => {
    try{
        const bookRecord = await BookRecord.findById(bookRecordId);
        return {
            ...bookRecord._doc,
            book: singleBook.bind(this, bookRecord._doc.book),
            issuedOn: dateToString(bookRecord._doc.issuedOn),
            dueOn: dateToString(bookRecord._doc.dueOn),
            createdAt: dateToString(bookRecord._doc.createdAt),
            updatedAt: dateToString(bookRecord._doc.updatedAt)
        };
    } catch(err) {
        throw err;
    }
}

const bookRecords = async bookRecordIds => {
    try{
        const records = await BookRecord.find(
            {
                _id: { $in: bookRecordIds }
            }
        );
        return records.map(bookRecord => {
            return {
                ...bookRecord._doc,
                book: singleBook.bind(this, bookRecord._doc.book),
                issuedOn: dateToString(bookRecord._doc.issuedOn),
                dueOn: dateToString(bookRecord._doc.dueOn),
                createdAt: dateToString(bookRecord._doc.createdAt),
                updatedAt: dateToString(bookRecord._doc.updatedAt)
            };
        });
    } catch(err) {
        throw err;
    }
}

const singleBook = async bookId => {
    try{
        const book = await Book.findById(bookId);
        return {
            ...book._doc,
            publicationDate: dateToString(book._doc.publicationDate),
            rack: singleRack.bind(this, book._doc.rack),
            issuedBy: singleUser.bind(this, book._doc.issuedBy),
            checkedOutBy: singleUser.bind(this, book._doc.checkedOutBy),
            createdAt: dateToString(book._doc.createdAt),
            updatedAt: dateToString(book._doc.updatedAt)
        };
    } catch(err) {
        throw err;
    }
}

exports.singleBook = singleBook;
exports.singleRack = singleRack;
exports.singleBookRecord = singleBookRecord;
exports.singleLibraryCard = singleLibraryCard;
exports.singleUser = singleUser;
exports.bookRecords = bookRecords
