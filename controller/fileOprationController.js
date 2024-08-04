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


// const writeFile = async (req, res) => {
//     try {
//         const jsonData = await FileOperation.find()
//         if (!jsonData) {
//             return res.status(200).send({ message: "no data found" })
//         }
//         const worksheet = xlsx.utils.json_to_sheet(jsonData)
//         const workbook = xlsx.utils.book_new();
//         xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet1')

//         const filePath = path.join(__dirname, 'output.xlxs')
//         // console.log(filePath, "--worksheettt")

//         xlsx.writeFile(workbook, filePath)
//         console.log(filePath)

//         res.download(filePath, 'output.xlsx', (err) => {
//             if (err) {
//                 console.error('Error sending the file:', err);
//                 res.status(500).send('Error sending the file.');
//             } else {
//                 fs.unlink(filePath, (err) => {
//                     if (err) console.error('Error removing the file:', err);
//                 });
//             }
//         })

//     } catch (error) {
//         console.error('Error writing Excel file:', error);
//         res.status(500).send('Error processing the request.');
//     }
// }


const writeFile = async (req, res) => {
    try {
        // Fetch data from the database
        const jsonData = await FileOperation.find();
        if (!jsonData || jsonData.length === 0) {
            return res.status(200).send({ message: "No data found" });
        }

        // Convert JSON data to worksheet
        const worksheet = xlsx.utils.json_to_sheet(jsonData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const filePath = path.join(__dirname, 'output.xlsx');
        console.log('File path:', filePath);
        try {
            xlsx.writeFile(workbook, filePath);
            console.log('File written successfully to', filePath);
        } catch (writeError) {
            console.error('Error writing file:', writeError);
            return res.status(500).send('Error writing file.');
        }

        fs.readFile(filePath, (readError, data) => {
            if (readError) {
                console.error('Error reading file:', readError);
                return res.status(500).send('Error reading file.');
            }
            const base64String = data.toString('base64');
            res.status(200).send({ file: base64String });

            fs.unlink(filePath, (unlinkError) => {
                if (unlinkError) {
                    console.error('Error removing the file:', unlinkError);
                } else {
                    console.log('File removed successfully');
                }
            });
        });


    } catch (error) {
        console.error('Error writing Excel file:', error);
        res.status(500).send('Error processing the request.');
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
    getImgFilename,
    writeFile
}