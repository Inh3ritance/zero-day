const express = require('express');
const http = require('http');
const socket = require('socket.io');
const app = express();
let cors = require('cors');
const server = http.createServer(app);
const Datastore = require('nedb');
const { instrument } = require('@socket.io/admin-ui');
let db = new Datastore();

/// create cron job for inactive 60 day deletion

const io = socket(server, {
    cors: {
        origin: '*',
    }
});

instrument(io, {
    auth: false,
    readonly: true,
});

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('Server running...'));

app.get('/users', (_, res) => {
    db.find({}, (err, docs) => {
        if(err) console.log(err);
        res.send(docs);
    });
});

app.post('/createUser', (req, res) => {
    db.findOne({ _id: req.body.user }, (err, doc) => {
        if(err) console.log(err);
        if(doc === null) {
            db.insert({ 
                _id: req.body.user,
            }, (err, _) => {
                if(err) console.log(err);
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(500);
        }
    });
});

io.on('connection', (socket) => {
    
    socket.on('login', (data) => {
        db.findOne({ _id: data.user }, (err, doc) => {
            if(err) console.log(err);
            if(doc.online) {
                io.to(socket.id).emit('updateSocket', { socket: doc.socket });
                socket.disconnect();
            } else if(doc !== null) {
                db.update({ _id: data.user }, { $set: { online: true, socket: socket.id } }, {}, (err, _) => {
                    if(err) console.log(err);
                    io.to(socket.id).emit('updateSocket', { socket: socket.id });
                });
            }
        });
    });

    socket.on('disconnect', () => {
        db.update({ socket: socket.id }, { $set: { online: false, socket: null } }, {}, (err, _) => {
            if(err) console.log(err);
        });
    });

    socket.on('sendRequest', (friend) => {
        db.findOne({ 
            _id: friend 
        }, (err, doc) => {
            if(err) console.log(err);
            if(doc !== null && doc.online) {
                console.log(doc);
                //io.to(socket).emit('recieveRequest', {  });
            }
        });
    });

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