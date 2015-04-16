var util = require('util');
var path = require('path');
var _ = require('lodash');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Habitat = require('habitat');
var mongoose = require('mongoose');
var request = require('request');
var app = module.exports = express();



// Define env
Habitat.load();
var env = new Habitat('daytona');



// Set up database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOLAB_URI);
var posts = db.get('posts');



// Define app properties
app.set('port', process.env.PORT || 1234);


// Set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Serve static files from project root
app.use('/', express.static(path.normalize(__dirname + '/public')));


// Set up session
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  name: 'daytona-chat',
  secret: _.uniqueId(),
  saveUninitialized: true,
  resave: true,
  env: 'dev'
}));




// Set up web sockets
var io = require('socket.io').listen(app.listen(app.get('port')));




// Front view
app.get('/', function (req, res) {

  posts.find({}, {sort: {date: 1}}, function (err, posts) {
    if (err) throw err;

    res.render('index', {
      posts: posts
    });
  });

});




app.use('/slack-chat', function (req, res) {
  res.json({
    message: 'Hooray! Thanks for the post!'
  });

  var date = new Date();
  var niceDate = date.getHours() + ':' + date.getMinutes();

  // Emit to client
  io.emit('chat', {
    message: req.body.text,
    username: req.body.user_name,
    date: niceDate
  });

  // Save to database
  posts.insert({
    body: req.body.text,
    user: req.body.user_name,
    date: date,
    niceDate: niceDate
  });
});




io.sockets.on('connection', function (socket) {

  socket.on('message', function (data) {

    var date = new Date();
    var niceDate = date.getHours() + ':' + date.getMinutes();

    request({
      uri: 'https://hooks.slack.com/services/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',
      method: 'POST',
      body: JSON.stringify({
        username: data.username || 'Daybota',
        text: data.message
      })
    }, function (err, response, body) {
      if (err) throw err;

      // Emit to client
      socket.emit('chat', {
        message: data.message,
        username: data.username,
        date: niceDate
      });

      // Save to database
      posts.insert({
        body: data.message,
        user: data.username || 'Daybota',
        date: date,
        niceDate: niceDate
      });

    });
  });
});


