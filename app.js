const express = require("express");
const app = express();

var session = require('express-session');
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

var path = require("path")

const server = app.listen(8000);
const io = require('socket.io')(server);

app.get('/', function (req, res) {
    res.render("index");
});

io.on('connection', function (socket) {
    console.log("***********CONNECTED***********");

    var users = {};

    socket.on('got_a_new_user', function (name) {
        console.log(name);
        socket.name=name
        users[socket.id]=name;
        console.log(users);

    });
    socket.on('new_message', function (data) {
        console.log(data.message);
        console.log(data.sender)
        io.emit('message', { response: data.message, sender: data.sender})
    });

});