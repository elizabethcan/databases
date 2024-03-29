var models = require('../models');

var mysql = require('mysql');


module.exports = {
  messages: {
    // Ditto as above
    get: function (req, res) {
      models.messages.get({} ,(err, data) => {
        if (err) throw err;
        res.status(200);
        res.json(data);
      });
    },
    post: function (req, res) {
      models.messages.post(req.body, (err, data) => {
        if (err) throw err;
        res.status(201);
        res.json(data);
      });
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get()
      .then((data) => {
        res.status(200);
        res.json(data);
      })
      .catch((err) => {
        res.status(400)
        res.send(err);
      })
    },
    post: function (req, res) {
      models.users.post(req.body)
      .then((data) => {
        res.status(200);
        res.json(data);
      })
      .catch((err) => {
        res.status(400)
        res.send(err);
      })
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
        res.status(201);
        res.json(data);
      });
    }
  }
};

