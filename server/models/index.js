var db = require('../db');


var models = {
  messages: {
    get: function (options, callback) {
      
    }, // a function which produces all the messages
    post: function (data, callback) {
      db.Message.create()
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (options, callback) {
      return db.User.findAll();
    },
    post: function (data ,callback) {
      return db.User.create({username: 'Jean Valjean'});
    }
  },

}

module.exports = models;
