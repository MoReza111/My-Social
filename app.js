const express = require('express')
const boddyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const { Server } = require("socket.io")
const http = require('http')

require('dotenv').config()

const db = require('./db')
const passportConfig = require('./config/passport')
const homeRouter = require('./routes/index')
const userRouter = require('./routes/users')
const postRouter = require('./routes/posts')

const app = express()

const server = http.createServer(app)
const io = new Server(server)

// Passport Config
passportConfig(passport)

// Bopdyparser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
app.use('/posts',postRouter)

// Socket i/o
io.on('connection', (socket) => {
  console.log("Connected!")
  let sql,query
  socket.on('follow',(set)=>{
    console.log(set)
    sql = `INSERT INTO followers SET ?`
    query = db.query(sql,set,(err)=>{
      if(err) throw err
    })
  })

  socket.on('unfollow',(set)=>{
    console.log(set)
    sql = `DELETE FROM followers WHERE follower_id = '${set.follower_id}'AND following_id = '${set.following_id}'`
    query = db.query(sql,(err)=>{
      if(err) throw err
    })
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT,()=>{
    console.log(`Server started and listening on port ${PORT}`)
})