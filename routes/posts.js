const express = require('express')
const { v4: uuidv4 } = require('uuid')

const {ensureAuthenticated} = require('./../config/auth')
const {imageUploading} = require('./../utils/multerConfiguration')
const db = require('./../db')

const router = express.Router()

router.post('/',imageUploading('posts','post'),ensureAuthenticated,(req,res,next)=>{
    const {content} = req.body

    const post = {post_id:uuidv4(),content,user_id:req.user.user_id}
    
    if(req.file){
        const media = {media_id: uuidv4(),media_name:req.file.filename}
        const pm = {post_id:post.post_id,media_id:media.media_id}
    }

    const sql1 = 'INSERT INTO posts SET ?'
    if(req.file){
        const sql2 = 'INSERT INTO media SET ?'
        const sql3 = 'INSERT INTO posts_media SET ?'
    }

    const query1 = db.query(sql1,post,(err,result)=>{
        if(err) console.error(err)
        console.log(result)
    })

    if(req.file){
        const query2 = db.query(sql2,media,(err,result)=>{
            if(err) console.error(err)
            console.log(result)
        })

        const query3 = db.query(sql3,pm,(err,result)=>{
            if(err) console.error(err)
            console.log(result)
        })
    }
    
    res.redirect('home')
})

module.exports = router