const express = require('express')
const db = require('./../db')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const passport = require('passport')

const timeSince = require('../utils/timeSince')

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

                const follow = {follower_id:user.user_id,following_id:user.user_id}
                sql = 'INSERT INTO followers SET ?'
                const query3 = db.query(sql,follow,(err,result)=>{
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

// Profile Page OR Other User Profiles Page
router.get('/profile/:username?',(req,res,next)=>{
    let sql,query
    let person,following
    if(req.params.username){
        sql = `
            SELECT * FROM followers
            WHERE follower_id = '${req.user.user_id}'
        `

        query = db.query(sql,(err,result)=>{
            if(err) throw err
            following = result
        })

        sql = `
            SELECT u.user_name, u.profile_image , u.user_id, p.post_id,p.content,p.created_at ,m.media_name  FROM users u
            JOIN posts p USING (user_id)
            LEFT JOIN posts_media pm USING (post_id)
            LEFT JOIN media m USING(media_id)
            WHERE  u.user_name = '${req.params.username}'
            ORDER BY p.created_at DESC
        `

        const findUserSQL = `
            SELECT user_name, profile_image , user_id , name  FROM users
            WHERE user_name = '${req.params.username}'
        `
        const queryFindUserSQL = db.query(findUserSQL,(err,result)=>{
            if(err) throw err
            person = result[0]
        })

    }else if(req.user){
        sql = `
            SELECT u.user_name, u.profile_image , u.user_id, p.post_id,p.content,p.created_at ,m.media_name  FROM users u
            JOIN posts p USING (user_id)
            LEFT JOIN posts_media pm USING (post_id)
            LEFT JOIN media m USING(media_id)
            WHERE  u.user_name = '${req.user.user_name}'
            ORDER BY p.created_at DESC
        `

        person = req.user
    }else{
        req.flash('error_msg', 'Please log in to view that resource')
        return res.redirect('/users/login')
    }

    query = db.query(sql,(err,result)=>{
        if(err) throw err
        console.log(result)
        return res.render('profile', {posts : result , user:req.user ? req.user : null , getTime:timeSince , person, following})
    })
})

module.exports = router