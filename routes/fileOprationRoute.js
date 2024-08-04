const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, uploadeImg, getImgFilename, writeFile } = require('../controller/fileOprationController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload-file', upload.single('File'), uploadFile);
router.post('/upload-img', upload.single('File'), uploadeImg);
// router.get('/get-img', upload.single('File'), getImg);
router.get('/get-img/:filename', upload.single('File'), getImgFilename);
router.get('/get-exceldata', writeFile);


module.exports = router;
