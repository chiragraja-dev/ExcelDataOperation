const mongoose = require('mongoose')

const fileOperationSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    capital: {
        type: String,
        require: true,
    },
    currency: {
        type: String,
        require: true,
    },
})

const FileOperation = mongoose.model('FileOperation', fileOperationSchema)
module.exports = FileOperation 