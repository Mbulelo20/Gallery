const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db')

const app = express();
connectDB();

app.use(express.json({extended: false}))

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/home', require('./routes/home'))
app.use('/signup', require('./routes/signup'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})