require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middleware/errorMiddleware')
const corsMiddleware = require('./middleware/corsMiddlewares')
const path = require ('path');
const fileUpload = require('express-fileupload')
const {socketHandler} = require('./utils/socket');
const cookieSession = require('cookie-session');
const http = require('http');

const PORT = process.env.PORT || 9000
const KEY = process.env.COOKIE_KEY || 'key'
const corsUrls = (process.env.CORS_URLS || '*').split(',');
console.log(process.env.CORS_URLS)

const app = express()
const server = http.createServer(app);

app.set('trust proxy', 1);

app.use(
    cookieSession({
        name: 'session',
        keys: [KEY],
        maxAge: 3 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'none',
    })
);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: (origin, callback) =>
            callback(null, corsUrls.includes('*')
                || corsUrls.includes(origin)),
        credential: true,
    },
});
socketHandler(io);
app.use(corsMiddleware)
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credential: true,
    origin: (origin, callback) =>
        callback(null, corsUrls.includes('*')
            || corsUrls.includes(origin)),
}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorMiddleware)


const start = async () =>{
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        await server.listen(PORT, ()=> console.log(`Server started on ${PORT}`))

    }catch(e){
        console.log(e.message)
    }
}

start()