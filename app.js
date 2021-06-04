const app = require('express')()


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server started and listening on port ${PORT}`)
})