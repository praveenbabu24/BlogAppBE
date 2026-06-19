require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./Routes/auth')
const postRoutes = require('./Routes/post')
const cookieParser = require('cookie-parser')
const app = express()
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
	limit: 100,
})

app.use(cors({
    origin: 'https://blog-app-fe-drab.vercel.app/',
    methods:['GET','POST','PUT','DELETE'],
    credentials: true
}))
app.use(helmet({crossOriginResourcePolicy:false}))
app.use(express.json({limit: '10kb'}))
app.use(cookieParser())
app.use(limiter)
app.use('/api/auth',authRoutes)
app.use('/api/post',postRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MDB connected"))
.catch((err) => console.log(err))

app.listen(process.env.PORT,() => {
    console.log(`port: ${process.env.PORT}`)
})
