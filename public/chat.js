// Make connection
const PORT = 3000;
var socket = io.connect('novelin-chat.herokuapp.com') || io.connect(`http://localhost:${PORT}`);

// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');
    chatWindow = document.getElementById('chat-window');
    form = document.querySelector('form');
    pingSound = new Audio('https://srv-file16.gofile.io/download/EY65k3/ping_sound.mp3');

// Emit events
function scrollChatToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight
}

function handleSend(e) {
  if (handle.value == '') {
      alert('Please enter your name')
  } else if (message.value == '') {
      alert('Please enter your message')
  } else {
      socket.emit('chat_dari_client', {
          message: message.value,
          handle: handle.value
      });

      // Disable the input so user can't change name
      handle.disabled = true;

      // Clear di input message after sending message
      message.value = '';
  }
}

// btn.addEventListener('click', function() {
  // if (handle.value == '') {
  //   alert('Please enter your name')
  // } else if (message.value == '') {
  //     alert('Please enter your message')
  // } else {
  //     socket.emit('chat_dari_client', {
  //         message: message.value,
  //         handle: handle.value
  //     });

  //     // Disable the input so user can't change name
  //     handle.disabled = true;

  //     // Clear di input message after sending message
  //     message.value = '';
  // }
// });

form.addEventListener('submit', function(e) {
  e.preventDefault();
  handleSend();
});

message.addEventListener('keypress', function() {
    socket.emit('typing', handle.value)
})

// Listen for events
socket.on('chat_dari_server', function(data) {
    feedback.innerHTML = '';
    
    time = '[' + data.hour + ':' + data.minute + ']';

    color = data.handle == handle.value ? 'style="color: orange;"' : '';
    output.innerHTML += '<p>' + time + ' <strong '  + color + '>' + data.handle + ': </strong>' + data.message + '</p>';
    scrollChatToBottom();
    data.handle !== handle.value && pingSound.play();
});

socket.on('typing', function(data) {
    if (data == '') data = 'someone';
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
    scrollChatToBottom();
})