// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// Emit events

btn.addEventListener('click', function() {
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
});

message.addEventListener('keypress', function() {
    socket.emit('typing', handle.value)
})

// Listen for events
socket.on('chat_dari_server', function(data) {
    feedback.innerHTML = '';
    hour = data.hour<10 ? '0' + data.hour : data.hour;
    minute = data.minute<10 ? '0' + data.minute : data.minute;
    time = '[' + hour + ':' + minute + ']';
    
    output.innerHTML += '<p>' + time + ' <strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data) {
    if (data == '') data = 'someone';
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
})