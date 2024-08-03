const mongooes = require('mongoose');
const imageUploadSchema = new mongooes.Schema({
    filename: String,
    data: Buffer,
    contentType: String,
}, { timestamps: true });

const ImageUpload = mongooes.model('ImageUpload', imageUploadSchema)

module.exports = ImageUpload