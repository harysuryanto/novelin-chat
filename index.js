var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function() {
    console.log('listening to request on port 4000')
});

// Static files
app.use(express.static('public'));

// Socket setup
var io = socket(server);

io.on('connection', function(socket) {
    console.log('made socket connection', socket.id)

    socket.on('chat_dari_client', function(data) {
        var d = new Date(); // for now
        io.sockets.emit('chat_dari_server', {
            handle: data.handle,
            message: data.message,
            hour: d.getHours(),
            minute: d.getMinutes()
        })
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data)
    })
});