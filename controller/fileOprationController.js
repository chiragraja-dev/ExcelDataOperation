const FileOperation = require('../model/fileOperation');
const ImageUpload = require('../model/imageUpload');
const express = require('express');
const xlsx = require('xlsx');
const path = require('path')
const upload = require('../config/multerConfig')
const fs = require('fs');


const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }
        const workbook = xlsx.readFile(file.path);
        const sheet_name_list = workbook.SheetNames;
        const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        await FileOperation.insertMany(xlData)
        res.status(200).send('Data successfully uploaded and saved to the database.');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error processing the file.');
    }
};

const uploadeImg = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json("Invalid file or no file uploaded")
        }
        const newFile = new ImageUpload({
            filename: req.file.originalname,
            data: fs.readFileSync(req.file.path),
            contentType: req.file.mimetype,
        });
        const data = await newFile.save();
        fs.unlinkSync(req.file.path);
        res.status(200).json({ message: 'Image successfully uploaded' });
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message);
    }
}


const getImgFilename = async (req, res) => {
    try {
        const image = await ImageUpload.findOne({ filename: req.params.filename });
        console.log('Filename received:', req.params.filename);
        if (!image) {
            return res.status(404).send('Image not found');
        }
        res.set('Content-Type', image.contentType);
        res.send(image.data);
    } catch (error) {
        console.log('Error retrieving image by filename:', error.message);
        res.status(500).send(error.message);
    }
};


// const getImgFilename = async (req, res) => {
//     const filePath = path.join(__dirname, 'uploads', req.params.filename);
//     fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//             return res.status(404).send('File not found');
//         }
//         res.sendFile(filePath);
//     });
// };

module.exports = {
    uploadFile,
    uploadeImg,
    // getImg,
    getImgFilename
}