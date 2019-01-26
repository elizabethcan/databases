var db = require('../db');
var models = {
  messages: {
    get: function (callback) {
      db.query(`
        SELECT * FROM messages
      `, () => {

      });
    }, // a function which produces all the messages
    post: function (data, callback) {
      models.rooms.get(callback, {name: data.roomname, id: data.id})
      db.query(`

      `, () => {
        
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.query(`
        SELECT * from users
      `, () => {
        
      });
    },
    post: function (callback) {
      db.query(`

      `, () => {
        
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
              callback(null, results);
            }
          });
        } else {
          callback(null);
        }
      });
    }
  }
};

module.exports = models;
