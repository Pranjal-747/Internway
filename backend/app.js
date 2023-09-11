const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path:'./config.env'});

const db= process.env.database
mongoose.connect(db,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});


app.use(require('./router/route'));

app.use('/uploads',express.static('u'));



app.get('/', (req, res) => {
    res.send(`hello world from the server router `)
});

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server started on port `+ port);
});
