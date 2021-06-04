const express = require('express')
const db = require('./../db')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const passport = require('passport')

const router = express.Router()

// Login Page
router.get('/login',(req,res,next)=>{
    res.render('login')
})

// Login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next)
})

// Register Page
router.get('/register',(req,res,next)=>{
    res.render('register')
})

// Register Handle
router.post('/register',(req,res,next)=>{
    const {username , name , email ,password} = req.body
    let errors = []

    // Check required fields
    if(!name || !email || !password || !username){
        errors.push({msg : 'Please fill in all fields'})
    }

    // Check Pass length
    if(password.length < 6){
        errors.push({msg:'Password should be at least 6 characters'})
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            username
        })
    }else{
        let sql = `SELECT * FROM users WHERE user_name = '${username}'`
        const query1 = db.query(sql,async(err,result)=>{
            if(err) console.error(err)
            if(result.length === 0){
                // Hash the password with cost 12 
                const hashedPass = await bcrypt.hash(password, 12)

                const user = {user_id: uuidv4(),user_password:hashedPass,user_name:username,name,user_email:email}
                sql = 'INSERT INTO users SET ?'
                const query2 = db.query(sql,user,(err,result)=>{
                    if(err) console.error(err)
                    console.log(result)
                })
                req.flash('success_msg','You are now registered and can login')
                return res.redirect('/users/login')
            }else{
                // User Exists
                errors.push({msg:'Username is already registered'})
                return res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    username
                })
            }
        })
    }
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