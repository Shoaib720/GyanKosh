const express = require('express');
const multer = require('multer');
const router = express.Router();

const MIME_TYPE_MAP = {
    'image/jpeg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('INVALID_MIME_TYPE');
        if(isValid) error = null;
        cb(error, './uploads/images/cover-images');
    },
    filename: (req, file, cb) => {
        const name = req.body.title;
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '_' + Date.now() + '.' + ext);
    }
});

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const upload = multer({ storage: multerStorage, limits: { fileSize: MAX_IMAGE_SIZE } });

