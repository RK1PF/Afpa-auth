require('dotenv').config();

const mongoose = require('mongoose');

const DB = process.env.DB_NAME
const URI = process.env.DB_URI + DB;

const MongoDBClient = {
    init: () => {
        try {
            const client = mongoose.connect(URI, {
                useNewUrlParser: true, useUnifiedTopology: true
            })
            client.then(()=> console.log(`🔥 connected to DB: ${DB}`))
        } catch(e) {
            throw Error(e)
        }
    }
}

module.exports = MongoDBClient;