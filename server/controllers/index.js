var models = require('../models');

var mysql = require('mysql');


module.exports = {
  messages: {
    get: function (req, res) {
      connection.query(`
        SELECT * FROM messages 
        INNER JOIN rooms 
        ON rooms.id = messages.room_id
      `, function (error, results, fields) {
          if (error) { throw error; }
          console.log('Get request messages', results);
          res.status(200).json(results);
        });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      var text = req.body.message;
      console.log('req.text', text);
      debugger;
      // If roomname was specified on object then proceed else set to lobby
      if (req.body.roomname) {
        // Find room by roomname
        connection.query(`
          SELECT * FROM rooms 
          WHERE name="${req.body.roomname}"
        `, function(error, results, fields) {
          debugger;
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
      models.rooms.get({} ,(err, data) => {
        if (err) throw err;
        res.status(200);
        res.json(data);
      });
    },
    post: function (req, res) {
      models.rooms.post(req.body, (err, data) => {
        if (err) throw err;
        res.status(200);
        res.json(data);
      });
    }
  }
};

