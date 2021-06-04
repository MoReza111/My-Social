const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : process.env.MYSQL_PASSWORD,
    database : 'uni_project'
})

connection.connect((err)=>{
    if(err){
        console.error(err)
        throw err
    }
    console.log('Connected to DB (MYSQL)')
})

module.exports = connection