const Book = require('../../models/book');
const { transformBook } = require('../helpers/transform');
const ErrorUtility = require('../helpers/errors-utility');

module.exports = {
    books: async (args, req) => {
        try{
            const books = await Book.find().sort({ updatedAt: -1 });
            return books.map(book => {
                return transformBook(book, req);
            });
        }
        catch(err) {
            throw new Error(ErrorUtility.INTERNAL_SERVER_ERROR);
        }
    },

    booksByAuthor: async (args) => {
        try {
            const books = await Book.find({authors: { "$regex": args.author, "$options": "i" } })
            .sort({ updatedAt: -1 });
            return books.map(book => { return transformBook(book) });
        } catch (err) {
            throw new Error(ErrorUtility.INTERNAL_SERVER_ERROR);
        }
    },

    booksByTitle: async (args, req) => {
        try {
            const books = await Book.find({title: { "$regex": args.title, "$options": "i" } })
            .sort({ updatedAt: -1 });
            return books.map(book => { return transformBook(book, req) });
        } catch (err) {
            throw new Error(ErrorUtility.INTERNAL_SERVER_ERROR);
        }
    },

    booksByCategory: async (args, req) => {
        try {
            const books = await Book.find({category: { "$regex": args.category, "$options": "i" } })
            .sort({ updatedAt: -1 });
            return books.map(book => { return transformBook(book, req) });
        } catch (err) {
            throw new Error(ErrorUtility.INTERNAL_SERVER_ERROR);
        }
    },

    booksByPublicationDate: async (args, req) => {
        try {
            const books = await Book.find(
                {
                    publicationDate: {
                        $gte: new Date(new Date(args.date).setHours(00,00,00)),
                        $lte: new Date(new Date(args.date).setHours(23,59,59))
                    }
                }
            )
            .sort({ updatedAt: -1 });
            return books.map(book => { return transformBook(book, req) });
        } catch (err) {
            throw new Error(ErrorUtility.INTERNAL_SERVER_ERROR);
        }
    },

}

