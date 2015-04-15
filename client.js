(function (window) {
  'use strict';

  var socket = io.connect();

  var $chat = $('#chat');
  var $chatForm = $('#chat-form');
  var $chatText = $('#chat-message');
  var $chatUsername = $('#chat-username');

  $chatText.focus();

  $chatForm.on('submit', function (e) {
    var message = $chatText.val();

    if (message.length) {
      socket.emit('message', {
        message: $chatText.val(),
        username: $chatUsername.val()
      });
      $chatText.val('');
    } else {
      alert('You must write a message first!!');
    }

    e.preventDefault();
    return false;
  });


  // CMD + Enter = Submit
  $(document.body).on('keydown', function (e) {
    if (e.keyCode == 13 && e.metaKey) {
      $chatForm.submit();
    }
  });


  socket.on('chat', function (data) {
    var date = new Date(),
    niceDate = date.getHours() + ':' + date.getMinutes();

    var message = '<div class="Chat-message" style="display:none">';
        message += '<p>' + data.message + '</p>';
        message += '<p class="Chat-messageMeta">' + niceDate + '</p>';
        message += '</div>';
    
    var $message = $(message);
    $chat.append($message);
    $message.slideDown('fast');
  });

}(this));