const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const libraryCardsController = require('../controllers/libraryCardsController');

const getUsers = (req, res, next) => {
    User.aggregate([
        { $project:  { 'password': 0, 'cardId': 0 }}
    ])
    .then(users => {
        res.status(200).json({
            message: 'SUCCESS',
            data: users
        });
    })
    .catch(_ => {
        res.status(404).json({
            message: "NOT_FOUND"
        });
    })
}

const signupAdmin = (req, res, next) => {
    if (req.body && req.body.password) {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                role: User.ADMIN,
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(createdUser => {
                var userDetails = {
                    id: createdUser._id,
                    name: createdUser.name
                }
                var cardId = libraryCardsController.createLibraryCard(userDetails);
                createdUser.cardId = cardId;
                createdUser.save()
                .then(_ => {
                    res.status(201).json({
                        message: 'SUCCESS'
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: "INTERNAL_SERVER_ERROR",
                        error: err
                    });
                });
            })
            .catch(err => {
                if (err.errors) {
                    if (err.errors.email) {
                        if (err.errors.email.name) {
                            if (err.errors.email.name === "ValidatorError") {
                                res.status(500).json({
                                    message: "EMAIL_ALREADY_EXISTS"
                                });
                            }
                        }
                    }
                }
                res.status(500).json({
                    message: "INTERNAL_SERVER_ERROR",
                    error: err
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "INTERNAL_SERVER_ERROR",
                error: err
            });
        });
    }
}

const signupLibrarian = (req, res, next) => {
    if (req.body && req.body.password) {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                role: User.LIBRARIAN,
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(_ => {
                res.status(201).json({
                    message: 'SUCCESS'
                });
            })
            .catch(err => {
                if (err.errors) {
                    if (err.errors.email) {
                        if (err.errors.email.name) {
                            if (err.errors.email.name === "ValidatorError") {
                                res.status(500).json({
                                    message: "EMAIL_ALREADY_EXISTS"
                                });
                            }
                        }
                    }
                }
                res.status(500).json({
                    message: "INTERNAL_SERVER_ERROR",
                    error: err
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "INTERNAL_SERVER_ERROR",
                error: err
            });
        });
    }
}

const signupCustomer = (req, res, next) => {
    if (req.body && req.body.password) {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                role: User.CUSTOMER,
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(_ => {
                res.status(201).json({
                    message: 'SUCCESS'
                });
            })
            .catch(err => {
                if (err.errors) {
                    if (err.errors.email) {
                        if (err.errors.email.name) {
                            if (err.errors.email.name === "ValidatorError") {
                                res.status(500).json({
                                    message: "EMAIL_ALREADY_EXISTS"
                                });
                            }
                        }
                    }
                }
                res.status(500).json({
                    message: "INTERNAL_SERVER_ERROR",
                    error: err
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "INTERNAL_SERVER_ERROR",
                error: err
            });
        });
    }
}

const login = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
    .then(fUser => {
        if (!fUser) {
            return res.status(401).json({
                message: 'AUTHENTICATION_FAILED'
            });
        }
        fetchedUser = fUser;
        return bcrypt.compare(req.body.password, fUser.password);
    })
    .then(result => {
        if (!result) {
            return res.status(401).json({
                message: 'AUTHENTICATION_FAILED'
            });
        }
        const token = jwt.sign(
            {
                uid: fetchedUser._id,
                email: fetchedUser.email,
                name: fetchedUser.name,
                role: fetchedUser.role,
                cardId: fetchedUser.cardId || null,
                issuedAt: new Date().getUTCMilliseconds(),
                expiresIn: 3600 * 3
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '3h' }
        );
        res.status(200).json({
            data: token
        });
    })
    .catch(_ => {
        return res.status(401).json({
            message: 'AUTHENTICATION_FAILED'
        });
    });
}

const update = (req, res, next) => {
    User.updateOne(
        { _id: req.params.id },
        {
            email: req.body.email,
            name: req.body.name,
        }
    )
    .then(_ => {
        res.status(201).json({
            message: 'SUCCESS'
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "INTERNAL_SERVER_ERROR",
            error: err
        });
    });
}

const updatePassword = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(fUser => {
        if (!fUser) {
            res.status(401).json({
                message: 'AUTHENTICATION_FAILED'
            })
        }
        return bcrypt.compare(req.body.oldPassword, fUser.password);
    })
    .then(comparisonResult => {
        if (!comparisonResult) {
            return res.status(401).json({
                message: 'AUTHENTICATION_FAILED'
            });
        }
        bcrypt.hash(req.body.newPassword, 10)
        .then(hash => {
            User.updateOne(
                { email: req.body.email },
                {
                    password: hash
                }
            )
            .then(() => {
                res.status(201).json({
                    message: 'SUCCESS'
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: "INTERNAL_SERVER_ERROR",
                    error: err
                });
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "INTERNAL_SERVER_ERROR",
            error: err
        });
    });
}

const deleteById = (req, res, next) => {
    User.findById({ _id: req.params.id })
    .then(user => {
        if(user.cardId){
            if(libraryCardsController.deleteLibraryCard(user.cardId)){
                user.delete();
                res.status(204).json({
                    message: "SUCCESS"
                });
            }
            else{
                res.status(500).json({
                    message: "INTERNAL_SERVER_ERROR"
                });
            }
        }
        user.delete();
        res.status(204).json({
            message: "SUCCESS"
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "INTERNAL_SERVER_ERROR",
            error: err
        });
    });
}

module.exports = {
    getUsers,
    signupAdmin,
    signupLibrarian,
    signupCustomer,
    login,
    update,
    updatePassword,
    deleteById
}