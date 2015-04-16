(function (window) {
  'use strict';

  var socket = io.connect();

  var $blog = $('#blog');
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
    var message = '<div class="Blog-post" style="display:none">';
        message += '<p class="Blog-postName">' + data.username + '</p>';
        message += '<p class="Blog-postMeta">' + data.date + '</p>';
        message += '<p class="Blog-postBody">' + data.message + '</p>';
        message += '</div>';
    
    var $message = $(message);
    $blog.prepend($message);
    $message.slideDown('fast');
  });

}(this));