const express = require('express')
const {ensureAuthenticated,forwardAuthenticated } = require('./../config/auth')

const router = express.Router()

router.get('/',forwardAuthenticated ,(req,res,next)=>{
    res.render('index')
})

router.get('/home',ensureAuthenticated,(req,res,next)=>{
    res.render('home')
})

module.exports = router