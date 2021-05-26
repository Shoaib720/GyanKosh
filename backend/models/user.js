const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, enum: ['customer', 'librarian', 'admin'], required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        card: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LibraryCard',
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

userSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: 'Error, expected {PATH} to be unique.'
});

export const CUSTOMER = 'customer';
export const LIBRARIAN = 'librarian';
export const ADMIN = 'admin';

module.exports = mongoose.model('User', userSchema, 'users');