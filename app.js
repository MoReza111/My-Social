const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const homeRouter = require('./routes/index')
const userRouter = require('./routes/users')

const app = express()

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