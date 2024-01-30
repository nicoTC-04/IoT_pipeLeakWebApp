const mysql = require('mysql');


const db = mysql.createConnection({
  host: '#############',
  user: '##########',
  password: '##############',
  database: 'iot'
});

/*
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});


db.end();*/

module.exports = db;