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
      connection.query(`
        SELECT * FROM messages 
        INNER JOIN rooms 
        ON rooms.id = messages.room_id
      `, function (error, results, fields) {
          if (error) { throw error; }
          console.log(results);
          res.status(200).json(results);
        });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      var text = req.body.message;
      console.log(text);
      // Query to check user and if that user didn't exist create on
      // get user id
      // '' rooms
      // Check if roomname exists
      if (req.body.roomname) {
        // Find room by roomname
        connection.query(`
          SELECT * FROM rooms 
          WHERE name="${req.body.roomname}"
        `, function(error, results, fields) {
          if (error) {
            throw error;
          }
          // if room doesn't exist create it with roomname
          if (results.length === 0) {
            connection.query(`
              INSERT INTO rooms(name)
              VALUES ("${req.body.roomname}")
            `, (error, results, fields) => {
              // Once room is created proceed with creating the message
              var roomId = results.insertId;
              connection.query(`
              INSERT INTO messages(text, room_id)
              VALUES ("${text}", "${roomId}");
            `, function (error, results, fields) {
                if (error) { throw error; }
                connection.query(`SELECT * FROM messages WHERE id=${results.insertId}`, function (error, results, fields) {
                  if (error) { throw error; }
                  res.status(201).json(results);
                });
              });
            });
          }
        });
      } else {
        // Set roomname to lobby
        connection.query(`
          INSERT INTO messages(text)
          VALUES ("${text}");
        `, function (error, results, fields) {
          if (error) { throw error; }
          connection.query(`SELECT * FROM messages WHERE id=${results.insertId}`, function (error, results, fields) {
            if (error) { throw error; }
            res.status(201).json(results);
          });
        });
      }
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      connection.query('SELECT * FROM users', function (error, results, fields) {
        if (error) { throw error; }
        console.log(results[0]);
        res.status(200).json(results);
      });
    },
    post: function (req, res) {
      console.log(req.body);
      var username = req.body.username;
      console.log(username);
      var query = `
        INSERT INTO users(name)
        VALUES ('${username}');
      `;
      connection.query(query, function (error, results, fields) {
        if (error) { throw error; }
        connection.query(`SELECT * FROM users WHERE id=${results.insertId}`, function (error, results, fields) {
          if (error) { throw error; }
          res.status(201).json(results);
        });
      });
    }
  },

  rooms: {
    // Ditto as above
    get: function (req, res) {
      connection.query('SELECT * FROM rooms', function (error, results, fields) {
        if (error) { throw error; }
        console.log(results[0]);
        res.status(200).json(results);
      });
    },
    post: function (req, res) {
      var roomname = req.body.roomname;
      var query = `
        INSERT INTO rooms(name)
        VALUES (${roomname});
      `;
      connection.query(query, function (error, results, fields) {
        if (error) { throw error; }
        connection.query(`SELECT * FROM roomname WHERE id=${results.insertId}`, function (error, results, fields) {
          if (error) { throw error; }
          res.status(201).json(results);
        });
      });
    }
  }
};

