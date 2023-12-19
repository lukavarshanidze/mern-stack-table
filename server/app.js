require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')

const app = express()


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next();
});

// app.use(express.static(path.join(__dirname, '../client/build')))
app.use(cors({
    origin: ["*"],
    methods: ["POST", "GET", "PUT", 'DELETE'],
    credentials: true
}));


app.use(bodyParser.json());
app.use(authRoutes);
app.use(productRoutes)

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

app.use((error, req, res, next) => {
    const status = error.statusCode || 500; // its  object we created .statusCode
    const message = error.message // exists default after passing value in new Error('this');
    const data = error.data
    res.status(status).json({ message: message, data: data })
})


mongoose.connect(`${process.env.MONGOOSE_CONNECT}`)
    .then(result => {
        app.listen(8000, () => {
            console.log('listening to 3000');
        })
    })
    .catch(err => {
        console.log(err);
    })


module.exports = app