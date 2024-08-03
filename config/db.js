const mongoose = require('mongoose')

const URL = 'mongodb://localhost:27017/excel-operation'
const mongoURL = URL

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('connected', () => {
    console.log("**************db connected***************");
});
db.on('disconnected', () => {
    console.log("********Not connected*************");
});
db.on('error', (err) => {
    console.log("Connection error: ", err);
});

module.exports = db