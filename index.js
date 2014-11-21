var koa = require('koa');
var env = require('node-env-file');
var body = require('koa-body');
var app = koa();

// Load environment variables
env(__dirname + '/.env');

app.use(body());

// Read request
app.use(function *(next){
  var body = this.request.body;
  var token = process.env.SLACK_TOKEN;
  var text = body.text;

  if ((token && (body.token !== token)) || (body.user_name === 'slackbot')) {
    yield next;
  }

  if (body.trigger_word) {
    text = body.text.replace(body.trigger_word, '').trim();
  }

  this.body = {
    text: ('Simon said: "' + text + '"')
  };
});

app.listen(process.env.PORT);
