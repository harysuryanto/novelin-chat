var express = require('express');
var socket = require('socket.io');

// App setup
const PORT = process.env.PORT || 3000;
var app = express();
var server = app.listen(PORT, function() {
    console.log(`listening to request on port ${PORT}`)
});

// Static files
app.use(express.static('public'));

// Socket setup
var io = socket(server);

io.on('connection', function(socket) {
    console.log('made socket connection', socket.id)

    socket.on('chat_dari_client', function(data) {
        var d = new Date();
        hour = d.getHours()<10 ? '0' + d.getHours() : d.getHours();
        minute = d.getMinutes()<10 ? '0' + d.getMinutes() : d.getMinutes();
        
        io.sockets.emit('chat_dari_server', {
            handle: data.handle,
            message: data.message,
            hour: hour,
            minute: minute
        });
        
        time = '[' + hour + ':' + minute + ']';
        console.log(time + ' ' + socket.id + ' (' + data.handle + ')' + ': ' + data.message);
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data)
    })
});