var models = require('../models');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'student',
  password: 'student',
  database: 'chat'
});
 
connection.connect();

module.exports = {
  messages: {
    get: function (req, res) {
      connection.query('SELECT * FROM messages', function (error, results, fields) {
        if (error) { throw error; }
        console.log(results[0]);
        res.status(200).json(results);
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      var query = `
        INSERT INTO messages(text)
        VALUES ('Hello Again');
      `;
      connection.query(query, function (error, results, fields) {
        if (error) { throw error; }
        connection.query(`SELECT * FROM messages WHERE id=${results.insertId}`, function (error, results, fields) {
          if (error) { throw error; }
          res.status(200).json(results);
        });
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};

