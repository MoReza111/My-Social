const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const db = require('./../db')

module.exports = (passport)=>{
    passport.use(
        new LocalStrategy({usernameField:'username'},(username,password,done)=>{
            // Match User
            let sql = `SELECT * FROM users WHERE user_name = '${username}'`
            const query = db.query(sql,async(err,result)=>{
                if(err) console.error(err)
                if(result.length === 0){
                    return done(null ,false,{message:'Invalid Credential'})
                }

                // Match Password
                const checkUserPass = await bcrypt.compare(password,result[0].user_password)
                console.log(result[0])
                if(checkUserPass){
                    return done(null,result[0])
                }
                return done(null,false,{message:'Invalid Credential'})
            })
        })
    )

    passport.serializeUser((user, done)=> {
        done(null, user.user_id)
    })
    
    passport.deserializeUser((id, done) =>{
        let sql = `SELECT * FROM users WHERE user_id = '${id}'`
        const query = db.query(sql,(err,result)=>{
            if(err) console.error(err)
            done(err, result[0])
        })
    })
}