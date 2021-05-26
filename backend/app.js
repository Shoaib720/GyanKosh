const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const booksRoute = require('./routes/books');

const app = express();

// =============================Database Connectivity=========================================


// Connect to local mongo db
// const LOCAL_URL = 'mongodb://127.0.0.1:27017/research-portal';
// mongoose.connect(LOCAL_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


// Connect to ATLAS
const REMOTE_URL = 'mongodb+srv://shoaib:' + process.env.MONGO_ATLAS_KEY + '@myfreecluster.uqauj.mongodb.net/gyankosh?retryWrites=true&w=majority';
mongoose.connect(REMOTE_URL, { useNewUrlParser: true, useUnifiedTopology: true });


// ===========================================================================================

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/uploads', express.static(path.join('./uploads')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'x-www-form-urlencodedOrigin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, UPDATE, DELETE, OPTIONS');
  next();
})
app.use('/api/v1/books', booksRoute);

// Holy shit it worked!

module.exports = app;
