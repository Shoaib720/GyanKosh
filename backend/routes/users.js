const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup/admin', usersController.signupAdmin);

router.post('/signup/customer', usersController.signupCustomer);

router.post('/signup/librarian', usersController.signupLibrarian);

router.post('/login', usersController.login);

router.put('/:id', usersController.update);

router.put('/update-password', usersController.updatePassword);

router.delete('/:id', usersController.deleteById);

router.use('/*', (req, res, next) => {
    res.status(404).json({
        error: "ROUTE_NOT_FOUND",
    });
});

module.exports = router;

