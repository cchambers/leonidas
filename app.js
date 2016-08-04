var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom').jsdom;

var scripts = '<script src="http://localhost/socket.io/socket.io.js"></script> '
            + '<script src="leo/jquery.js"></script>'
            + '<script src="leo/client.js"></script>';

app.use(express.static(path.join(__dirname, 'public')));
app.use('/leo', express.static('client'));

app.use('/', function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    var file = req.originalUrl;
    if (file == "/") {
        file = "/index.html";
    }
    fs.readFile(__dirname + '/testing/' + file, "utf-8", function (err, data) {
        if (data) {
            data = inject(data);
            res.status(200).send(data);
        }
        next();
    })
});

function inject(data) {
    var split = data.split("</body>");
    var toReturn = split[0] + scripts + "</body>" + split[1];
    return toReturn;
}

server.listen(80, function () {
    console.log('PREPARE FOR GLORY!');
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});