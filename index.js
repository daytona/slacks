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

  if (token && (body.token !== token)) {
    yield next;
  }

  console.log(body.user_name + ': ' + body.text);
});

// Response
app.use(function *(){
  this.body = '';
});

app.listen(process.env.PORT);
