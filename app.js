const app = require('express')()

const homeRouter = require('./routes/index')
const userRouter = require('./routes/users')

// Routes
app.use('/',homeRouter)
app.use('/user',userRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server started and listening on port ${PORT}`)
})