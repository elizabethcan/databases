var db = require('../db');
var models = {
  messages: {
    get: function (options, callback) {
      db.query(`
        SELECT * FROM messages
      `, (error, results) => {
        if (error) {
          callback(error);
        } else {
          callback(null, results);
        }
      });
    }, // a function which produces all the messages
    post: function (data, callback) {
      models.rooms.post({'name': data.roomname}, (err, results) => {
        var roomId = results;
        models.users.post({'name': data.username}, (err, results) => {
          var userId = results;
          var query = `
            INSERT messages(text, room_id, user_id) VALUES (?, ?, ?)
          `;
          var queryArgs = [data.message, roomId, userId]
          db.query(query, queryArgs, (error, results) => {
            if (error) {
              callback(error);
            } else {
              callback(null, results);
            }
          });
        })
      })
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (options, callback) {
      // options {
      //   id: '1'
      //   name: 'lobby'
      // }
      console.log(options);
      if (options.id) {
        // get one room by id
        var queryString = `
          SELECT * FROM users
          WHERE users.id = ?
        `;
        var queryArgs = [options.id];
        // Query
        db.query(queryString, queryArgs, (error, results) => {
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      } else if (options.name) {
        console.log('searching by name:', options.name)
        // get all users
        var queryString = `
          SELECT * FROM users
          WHERE users.name = ?
        `;
        var queryArgs = [options.name];
        db.query(queryString, queryArgs, (error, results) => {
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      } else {
        // get all users
        db.query(`
          SELECT * FROM users
        `, (error, results) => {
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      }
    },
    post: function (data ,callback) {
      if (data.username) {
        var name = data.username
      } else {
        var name = data.name;
      }
      models.users.get({
        'name': name
      }, (err, results) => {
        if (results.length === 0) {
          var query = `
          INSERT users (name) VALUES (?)
          `;
          var queryArgs  = [name]
          db.query(query, queryArgs, (error, results) => {
            if (error) {
              callback(error);
            } else {
              callback(null, results.insertId);
            }
          });
        } else {
          callback(null, results[0].id);
        }
      });
    }
  },

  rooms: {
    // Ditto as above.
    get: function (options, callback) {
      // options {
      //   id: '1'
      //   name: 'lobby'
      // }
      console.log(options);
      if (options.id) {
        // get one room by id
        var queryString = `
          SELECT * FROM rooms
          WHERE rooms.id = ?
        `;
        var queryArgs = [options.id];
        // Query
        db.query(queryString, queryArgs, (error, results) => {
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      } else if (options.name) {
        console.log('searching by name:', options.name)
        // get all rooms
        var queryString = `
          SELECT * FROM rooms
          WHERE rooms.name = ?
        `;
        var queryArgs = [options.name];
        db.query(queryString, queryArgs, (error, results) => {
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      } else {
        // get all rooms
        db.query(`
          SELECT * FROM rooms
        `, (error, results) => {
          if (error) {
            callback(error);
          } else {
            callback(null, results);
          }
        });
      }
    },
    post: function (data ,callback) {
      if (data.roomname) {
        var name = data.roomname
      } else {
        var name = data.name;
      }
      models.rooms.get({
        'name': name
      }, (err, results) => {
        console.log(results)
        if (results.length === 0) {
          var query = `
          INSERT rooms (name) VALUES (?)
          `;
          var queryArgs  = [name]
          db.query(query, queryArgs, (error, results) => {
            if (error) {
              callback(error);
            } else {
              callback(null, results.insertId);
            }
          });
        } else {
          callback(null, results[0].id);
        }
      });
    }
  }
};

module.exports = models;
