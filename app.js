const express = require('express')
const boddyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

require('dotenv').config()

const passportConfig = require('./config/passport')
const homeRouter = require('./routes/index')
const userRouter = require('./routes/users')

const app = express()

// Passport Config
passportConfig(passport)

// Bopdyparser
app.use(boddyParser.urlencoded({extended:false}))

// Express Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global Vars
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
    
  next()
})

app.use(express.static('public'))

// EJS
app.use(expressLayouts)
app.set('view engine','ejs')

// Routes
app.use('/',homeRouter)
app.use('/users',userRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server started and listening on port ${PORT}`)
})