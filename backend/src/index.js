const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const cors = require('cors')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
    // CORS for credentialed requests from the frontend
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://127.0.0.1:3000'
]

const corsOptions = {
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'token'],
    exposedHeaders: ['set-cookie']
}

app.use(cors(corsOptions))



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(cookieParser())
app.use(bodyParser.json())

routes(app);



mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect DB success')
    })
    .catch((err) => {
        console.log(err)
    })


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})