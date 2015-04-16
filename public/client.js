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

    // TODO: Curse check!

    if (message.length || !message.startsWith('#simonsays')) {

      console.log('posting: ' {
        message: $chatText.val(),
        username: $chatUsername.val()
      });

      socket.emit('message', {
        message: $chatText.val(),
        username: $chatUsername.val()
      });
      $chatText.val('');
    } else if (message.startsWith('#simonsays')) {
      alert("I wouldn't try using #simonsays here! Who knows what could happen??");
    } else {
      alert("You must write a message first!!");
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



  // Signal recieved via web from the server!
  socket.on('chat', function (data) {
    var message = '<div class="Blog-post" style="display:none">';
        message += '<p class="Blog-postName">' + data.username + '</p>';
        message += '<p class="Blog-postMeta">' + data.date + '</p>';
        message += '<p class="Blog-postBody">' + data.message + '</p>';
       message += '</div>';

    console.log('emitted to client: ', data);

    var $message = $(message);
    $blog.prepend($message);
    $message.slideDown('fast');
  });



  // Dialog
  var $dialog = $('#info-dialog');
  $('#show-dialog').on('click', function () {
    $dialog[0].showModal();
  });
  $('#close-button').on('click', function () {
    $dialog[0].close();
  });

}(this));