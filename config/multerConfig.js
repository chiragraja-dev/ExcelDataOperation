const express = require('express')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    diskStorage: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

const imgFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/
    const mintype = filetypes.test(file.mintype)
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())

    if (mintype && extname) {
        return cb(null, true)
    }
    cb(new Error('Only images are allowed'));
}


const upload = multer({
    storage: storage,
    fileFilter: imgFilter,
    limits: { fileSize: 1024 * 1024 * 10 }
})

module.exports = upload