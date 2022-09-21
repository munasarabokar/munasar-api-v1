const mysql = require('mysql')

let conn = mysql.createConnection({
    host : 'localhost',
	database : 'store',
	user : 'root',
	password : ''
})

conn.connect(function(err) {
	if(err) console.log('database not working');
	  console.log('database workng');
})




module.exports = conn;