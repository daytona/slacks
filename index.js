var koa = require('koa');
var body = require('koa-body');
var app = module.exports = koa();

// Load environment variables
if (app.env === 'development') {
  require('node-env-file')(__dirname + '/.env');
}

app.use(body());

/**
 * Handshake-ish
 */
app.use(function *(next) {
  var body = this.request.body;
  var received = new Date();

  yield next;

  if (this.valid && this.text) {
    socket.emit('message', {
      text: this.text,
      name: body.user_name,
      timestamp: body.timestamp,
      delayed: (received - new Date(body.timestamp))
    });
  }
});

/**
 * Valid, are ya?
 */
app.use(function *(next) {
  var body = this.request.body;
  var token = process.env.SLACK_TOKEN;

  this.valid = (!token || (token && (body.token !== token)));

  yield next;

  this.valid = (this.valid && this.text);
});

/**
 * Parsage
 */
app.use(function *(next) {
  var body = this.request.body;

  if (body.trigger_word) {
    this.text = body.text.replace(body.trigger_word, '').trim();
  } else {
    this.text = body.text;
  }

  yield next;
});
});

app.listen(process.env.PORT);
