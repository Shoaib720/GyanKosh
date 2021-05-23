const Book = require('../models/book');
const libraryCardsController = require('../controllers/libraryCardsController');
const { promisify } = require('util');
const fs = require('fs');
const unlinkAsync = promisify(fs.unlink);

const getBookById = (req, res, next) => {
    Book.findById({ _id: req.params.id })
    .then(book => {
        book.coverImageURL = req.protocol + '://' + req.get('host') + '/' + book.coverImageURL;
        res.status(200).json({
            message: 'SUCCESS',
            data: book
        });
    })
    .catch(_ => {
        res.status(404).json({
            message: 'NOT_FOUND'
        });
    });
}

const getAllBooks = (req, res, next) => {
    Book.find()
    .then(
        books => {
            // books.coverImageURL = req.protocol + '://' + req.get('host') + '/' + book.coverImageURL;
            books.map(book => { return book.coverImageURL = req.protocol + '://' + req.get('host') + '/' + book.coverImageURL; });
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
    Book.find({title: { "$regex": req.params.title, "$options": "i" } }) // To find substring ignoring case
    .then(books => {
        books.map(book => { return book.coverImageURL = req.protocol + '://' + req.get('host') + '/' + book.coverImageURL; });
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

const getBooksByAuthor = (req, res, next) => {
    Book.find({authors: { "$regex": req.params.author, "$options": "i" } }) // To find substring ignoring case
    .then(books => {
        books.map(book => { return book.coverImageURL = req.protocol + '://' + req.get('host') + '/' + book.coverImageURL; });
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
    Book.find({category: { "$regex": req.params.category, "$options": "i" } }) // To find substring ignoring case
    .then(books => {
        books.map(book => { return book.coverImageURL = req.protocol + '://' + req.get('host') + '/' + book.coverImageURL; });
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
    if(req.params.date){
        Book.find(
            {
                publicationDate: {
                    $gte: new Date(new Date(req.params.date).setHours(00,00,00)),
                    $lte: new Date(new Date(req.params.date).setHours(23,59,59))
                }
            }
        )
        .sort({ publicationDate: 'asc' })
        .then(books => {
            books.map(book => { return book.coverImageURL = req.protocol + '://' + req.get('host') + '/' + book.coverImageURL; });
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
            book.coverImageURL = req.protocol + '://' + req.get('host') + '/' + book.coverImageURL;
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
        coverImageURL: 'uploads/images/cover-images/' + req.file.filename
    });
    imagePath = book.coverImageURL;
    book.save()
    .then(uploadedBook => {
        uploadedBook.coverImageURL = req.protocol + '://' + req.get('host') + '/' + uploadedBook.coverImageURL;
        res.status(201).json({
            message: 'SUCCESS',
            data: uploadedBook
        });
    })
    .catch(err => {
        unlinkAsync(imagePath);
        res.status(500).json({
            message: 'INTERNAL_SERVER_ERROR',
            error: err
        });
    })
}

const updateBook = (req, res, next) => {
    const book = {
        title: req.body.title,
        authors: req.body.authors.split(',').map(items => {return items.trim()}),
        category: req.body.category,
        keywords: req.body.keywords.split(',').map(items => {return items.trim()}),
        publicationDate: req.body.publicationDate,
        rackNumber: req.body.rackNumber,
        isIssued: req.body.isIssued,
        issuedBy: req.body.issuedBy,
        checkedOutBy: req.body.checkedOutBy,
        coverImageURL: 'uploads/images/cover-images/' + req.file.filename
    };
    let imagePath = book.coverImageURL;
    Book.findByIdAndUpdate(
        { _id: req.body.id },
        {
            title: req.body.title,
            authors: req.body.authors.split(',').map(items => {return items.trim()}),
            category: req.body.category,
            keywords: req.body.keywords.split(',').map(items => {return items.trim()}),
            publicationDate: req.body.publicationDate,
            rackNumber: req.body.rackNumber,
            isIssued: req.body.isIssued,
            issuedBy: req.body.issuedBy,
            checkedOutBy: req.body.checkedOutBy,
            coverImageURL: 'uploads/images/cover-images/' + req.file.filename
        },
        { new: true }
    )
    .then(updatedBook => {
        updatedBook.coverImageURL = req.protocol + '://' + req.get('host') + '/' + updatedBook.coverImageURL;
        res.status(201).json({
            message: 'SUCCESS',
            data: updatedBook
        });
    })
    .catch(err => {
        unlinkAsync(imagePath);
        res.status(500).json({
            message: 'INTERNAL_SERVER_ERROR',
            error: err
        });
    })
}

const deleteBook = (req, res, next) => {
    Book.findById({ _id: req.params.id })
    .then(book => {
        try{
            unlinkAsync(book.coverImageURL);
            book.delete();
        }
        catch(err){
            res.status(500).json({
                message: 'INTERNAL_SERVER_ERROR',
                error: err
            });
        }
    })
    .catch(_ => {
        res.status(404).json({
            message: 'NOT_FOUND'
        });
    })
}

module.exports = {
    getBookById,
    getAllBooks,
    getBooksByTitle,
    getBooksByAuthor,
    getBooksByCategory,
    getBooksByPublicationDate,
    issueBook,
    returnBook,
    addBook,
    updateBook,
    deleteBook,
}