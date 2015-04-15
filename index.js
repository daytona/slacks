var util = require('util');
var _ = require('lodash');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var app = module.exports = express();



// Define app properties
app.set('port', process.env.PORT || 1234);


// Serve static files from project root
app.use('/', express.static(__dirname + '/'));


// Set up session
app.use(cookieParser());
app.use(session({
  name: 'daytona-chat',
  secret: _.uniqueId(),
  saveUninitialized: true,
  resave: true,
  env: 'dev'
}));


// Front view
app.get('/', function (req, res) {
  res.render('index', {
    page: 'front'
  });
});

app.use('/slack-chat', function (req, res) {
  console.log(req.body);
});



var io = require('socket.io').listen(app.listen(app.get('port')));

io.sockets.on('connection', function (socket) {

  socket.on('message', function (data) {
    

    request({
      uri: 'https://hooks.slack.com/services/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',
      method: 'POST',
      body: JSON.stringify({
        username: data.username || 'Daytona Chat',
        text: data.message
      })
    }, function (error, response, body) {
      if (error) {
        console.log('Error', error);
        return;
      }

      console.log(response, body);

      socket.emit('chat', {
        message: data.message
      });
    });

  });

});