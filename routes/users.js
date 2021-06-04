const express = require('express')

const router = express.Router()

// Login Page
router.get('/login',(req,res,next)=>{
    res.render('login')
})

// Register Page
router.get('/register',(req,res,next)=>{
    res.render('register')
})

// Profile Page
router.get('/profile',(req,res,next)=>{
    res.send("HI there")
})

// Other User Profiles Page
router.get('/profile/:userID',(req,res,next)=>{
    res.send("HI there")
})


module.exports = router