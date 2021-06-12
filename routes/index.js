const express = require('express')

const {ensureAuthenticated,forwardAuthenticated } = require('./../config/auth')
const db = require('./../db')
const timeSince = require('../utils/timeSince')

const router = express.Router()

router.get('/',forwardAuthenticated ,(req,res,next)=>{
    res.render('index')
})

router.get('/home',ensureAuthenticated,(req,res,next)=>{
    let suggested,following
    let sql=`
        SELECT user_id, user_name FROM users
        ORDER BY RAND()
        LIMIT 4;
    `
    let query = db.query(sql,(err,result)=>{
        if(err) throw err
        suggested = result
    })

    sql = `
        SELECT * FROM followers
        WHERE follower_id = '${req.user.user_id}'
    `

    query = db.query(sql,(err,result)=>{
        if(err) throw err
        following = result
    })

    sql = `
        SELECT u.user_name, u.profile_image , u.user_id, p.post_id,p.content,p.created_at ,m.media_name,f.following_id  FROM users u
        JOIN posts p USING (user_id)
        LEFT JOIN posts_media pm USING (post_id)
        LEFT JOIN media m USING(media_id)
        JOIN followers f  ON f.following_id = u.user_id
        WHERE f.follower_id = '${req.user.user_id}'
        ORDER BY p.created_at DESC
    `
    query = db.query(sql,(err,result)=>{
        if(err) throw err
        return res.render('home', {posts : result , user:req.user , getTime:timeSince,suggested,following})
    })
    
})

module.exports = router