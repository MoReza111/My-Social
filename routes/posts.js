const express = require('express')
const { v4: uuidv4 } = require('uuid')

const {ensureAuthenticated} = require('./../config/auth')
const {imageUploading} = require('./../utils/multerConfiguration')
const db = require('./../db')

const router = express.Router()

router.post('/',imageUploading('posts','post'),ensureAuthenticated,(req,res,next)=>{
    const {content} = req.body

    const post = {post_id:uuidv4(),content,user_id:req.user.user_id}
    
    let media,pm

    if(req.file){
        media = {media_id: uuidv4(),media_name:req.file.filename}
        pm = {post_id:post.post_id,media_id:media.media_id}
    }

    const sql1 = 'INSERT INTO posts SET ?'
    let sql2,sql3
    if(req.file){
        sql2 = 'INSERT INTO media SET ?'
        sql3 = 'INSERT INTO posts_media SET ?'
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

router.post('/delete/:id',(req,res,next)=>{
    console.log(req.params)
    const {id}= req.params

    let sql = `
        SELECT * FROM posts_media
        WHERE post_id = '${id}'
    `
    let query = db.query(sql,(err,result)=>{
        if(err) throw err
        console.log(result)
        if(result.length !== 0){
            sql = `
                DELETE FROM media
                WHERE media_id = '${result[0].media_id}'
            `

            query = db.query(sql,(err)=>{
                if(err) throw err
                })
        }
    })

    sql = `
        DELETE FROM posts_media
        WHERE post_id = '${id}'
    `

    query = db.query(sql,(err)=>{
        if(err) throw err
    })


    sql = `
        DELETE FROM posts
        WHERE post_id = '${id}'
    `

    query = db.query(sql,(err)=>{
        if(err) throw err
    })

    
    res.redirect('/home')
})

module.exports = router