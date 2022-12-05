require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 5000;

const app = express()

app.use(express.json());
app.use(fileUpload({
    createParentPath: true
}));
app.use(cookieParser());
const whitelist = [
    process.env.CLIENT_URL,
    'https://'+process.env.CLIENT_URL,
    'https://www.'+process.env.CLIENT_URL,
    'https://react-casino-client.vercel.app'
]
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        console.log(origin)
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions));
app.use('/api', router);
app.use(errorMiddleware);
app.use(express.static('uploads', {
    setHeaders: function (res, path, stat) {
        res.set('Content-Type', 'image/png')
    }
}));

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await app.listen(PORT, () => {
            console.log('Server started at port ' + PORT);
        })
    } catch (e) {
        console.log(e)
    }
}

start();