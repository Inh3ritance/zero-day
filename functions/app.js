const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

app.get('/',(_, res) => res.send('Server running...'));

io.on('connection', (socket) => {
    socket.on('send message', ({ content, to, sender, chatName, isChannel }) => {
        if(isChannel) {
            const payload = {
                content,
                chatName,
                sender
            }
            socket.to(to).emit('new message', payload);
        } else {
            const payload = {
                content,
                chatName: sender,
                sender
            }
            socket.to(to).emit('new message', payload);
        }
    });
});

const port = 9000;
server.listen(port, () => console.log(`Server is running on port ${port}`));