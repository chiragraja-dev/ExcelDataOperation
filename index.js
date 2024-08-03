const express = require('express');
const app = express();
const db = require('./config/db')
const fileOperationRoutes = require('./routes/fileOprationRoute')

app.use(express.json())

app.use('/', fileOperationRoutes)
app.listen(3000)