const mongooes = require('mongoose');

const fileUploadSchema = new mongooes.Schema({
    filename: {
        type: String,
        require: true,
    },
    path: {
        type: String,
        require: true
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    }
})


const FileUpload = mongooes.model('FileUpload', fileUploadSchema)
module.exports = FileUpload