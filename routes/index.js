const express = require('express')

const {ensureAuthenticated,forwardAuthenticated } = require('./../config/auth')
const db = require('./../db')

const router = express.Router()

router.get('/',forwardAuthenticated ,(req,res,next)=>{
    res.render('index')
})

router.get('/home',ensureAuthenticated,(req,res,next)=>{
    const sql = `
        SELECT u.user_name, u.profile_image , u.user_id, p.post_id,p.content,p.created_at ,m.media_name  FROM users u
        JOIN posts p USING (user_id)
        LEFT JOIN posts_media pm USING (post_id)
        LEFT JOIN media m USING(media_id)
        JOIN followers f  ON f.following_id = u.user_id
        WHERE f.follower_id = '${req.user.user_id}'
    `
    const query = db.query(sql,(err,result)=>{
        if(err) throw err
        console.log(req.user)
        return res.render('home', {posts : result , user:req.user})
    })
    
})

module.exports = router