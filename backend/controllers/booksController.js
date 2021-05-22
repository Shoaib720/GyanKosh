const Book = require('../models/book');
const libraryCardsController = require('../controllers/libraryCardsController');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const Request2BookMapper = (req) => {
    const book = {
        title: req.title,
        authors: req.authors,
        category: req.category,
        keywords: req.keywords,
        publicationDate: req.publicationDate,
        rackNumber: req.rackNumber,
        isIssued: req.isIssued,
        issuedBy: req.issuedBy,
        checkedOutBy: req.checkedOutBy,
        coverImageURL: req.coverImageURL
    }
    return book;
}

const getAllBooks = (req, res, next) => {
    Book.find()
    .then(
        books => {
            res.status(200).json({
                message: 'SUCCESS',
                data: books
            });
        }
    )
    .catch(_ => {
        res.status(404).json({
            message: 'NOT_FOUND'
        });
    });
}

const getBooksByTitle = (req, res, next) => {
    Book.find({title: { "$regex": req.body.title, "$options": "i" } }) // To find substring ignoring case
    .then(books => {
        res.status(200).json({
            message: 'SUCCESS',
            data: books
        });
    })
    .catch(_ => {
        res.status(404).json({
            message: 'NOT_FOUND'
        });
    });
}

const getBooksByAuthors = (req, res, next) => {
    Book.find({authors: { "$regex": req.body.authors, "$options": "i" } }) // To find substring ignoring case
    .then(books => {
        res.status(200).json({
            message: 'SUCCESS',
            data: books
        });
    })
    .catch(err => {
        res.status(404).json({
            message: 'NOT_FOUND'
        });
    });
}

const getBooksByCategory = (req, res, next) => {
    Book.find({category: { "$regex": req.body.category, "$options": "i" } }) // To find substring ignoring case
    .then(books => {
        res.status(200).json({
            message: 'SUCCESS',
            data: books
        });
    })
    .catch(_ => {
        res.status(404).json({
            message: 'NOT_FOUND'
        });
    });
}

const getBooksByPublicationDate = (req, res, next) => {
    if(req.body.startDate && req.body.endDate){
        Book.find(
            {
                publicationDate: {
                    $gte: new Date(new Date(req.body.startDate).setHours(00,00,00)),
                    $lte: new Date(new Date(req.body.endDate).setHours(23,59,59))
                }
            }
        )
        .sort({ publicationDate: 'asc' })
        .then(books => {
            res.status(200).json({
                message: 'SUCCESS',
                data: books
            });
        })
        .catch(err => {
            res.status(404).json({
                message: 'NOT_FOUND'
            });
        });
    }
    else{
        res.status(400).json({
            message: 'BAD_REQUEST'
        });
    }
    
}

const issueBook = (req, res, next) => {
    if(libraryCardsController.isIssuable(req.body.libraryCardId)){
        Book.findByIdAndUpdate(
            {
                _id: req.body.bookId
            },
            {
                $set: {
                    isIssued: true,
                    issuedBy: req.body.issuedBy,
                    checkedOutBy: req.body.checkedOutBy
                }
            },
            { new: true }
        ) // To find substring ignoring case
        .then(book => {
            const today = new Date();
            const issuingDetails = {
                cardId: req.body.libraryCardId,
                bookId: book._id,
                title: book.title,
                issuedOn: today,
                dueOn: new Date(new Date().setDate(today.getDate() + 10))
            }
            const updatedLibraryCard = libraryCardsController.enterBookIssuingDetails(issuingDetails);
            res.status(200).json({
                message: 'SUCCESS',
                data: {
                    issuedBook: book,
                    updatedLibraryCard: updatedLibraryCard
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'INTERNAL_SERVER_ERROR'
            });
        });
    }
    else{
        res.status(412).json({
            message: 'PRECONDITION_FAILED'
        });
    }
}

const returnBook = (req, res, next) => {
    Book.findById({ _id : req.body.bookId })
    .then(book => {
        if(book.isIssued){
            book.isIssued = false;
            book.issuedBy = null;
            book.checkedOutBy = null;
            book.save()
            .then(_ => {
                const fine = libraryCardsController.generateFine(req.body.cardId);
                res.status(200).json({
                    message: 'SUCCESS',
                    data: fine
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: 'INTERNAL_SERVER_ERROR',
                    error: err
                })
            });
        }
        else{
            res.status(412).json({
                message: 'PRECONDITION_FAILED'
            });
        }
    })
    .catch(_ => {
        res.status(404).json({
            message: 'NOT_FOUND'
        });
    });
}

const addBook = (req, res, next) => {
    let imagePath;
    const book = new Book({
        title: req.body.title,
        authors: req.body.authors.split(',').map(items => {return items.trim()}),
        category: req.body.category,
        keywords: req.body.keywords.split(',').map(items => {return items.trim()}),
        publicationDate: req.body.publicationDate,
        rackNumber: req.body.rackNumber,
        isIssued: req.body.isIssued,
        issuedBy: req.body.issuedBy,
        checkedOutBy: req.body.checkedOutBy,
        coverImageURL: 'uploads/images/cover-images/' + req.coverImage.filename
    });
    imagePath = book.coverImageURL;
    book.save()
    .then(uploadedBook => {
        res.status(201).json({
            message: 'SUCCESS',
            data: uploadedBook
        });
    })
    .catch(err => {
        unlinkAsync(imagePath);
        res.status(500).json({
            message: 'INTERNAL_SERVER_ERROR'
        });
    })
}

module.exports = {
    getAllBooks,
    getBooksByTitle,
    getBooksByAuthors,
    getBooksByCategory,
    getBooksByPublicationDate,
    issueBook,
    returnBook,
    addBook
}