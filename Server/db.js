const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'url_shortener_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Export the connection instance so it can be used in other files via require('./db')
module.exports = db;