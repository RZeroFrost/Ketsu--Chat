var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Rx = require('rx'),
    Immutable = require('immutable');

var usersMap = Immutable.Map({});
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: false
    }));
app.use('/', express.static(path.join(__dirname, 'client')));

//Server start-up logic / port definition
var server = app.listen(3000);
console.log('[SERVER] Launched and listening on port 3000');

//SERVER CONNECTION NOTIFY EVENT
var io = require('socket.io')(server);
var sourceConnect = Rx.Observable.create(function(observer) {
    io.on('connection', function(socket) {
        console.log('[BACKBONE] Notifying server of client connection on socket: ', socket.id);
        socket.emit('my socketId', {'socketId': socket.id, 'connectTime': Date.now()});
        socket.on('client connect', function(data) {
            observer.onNext({'socket': socket, 'data': data, 'event': 'client connect'});       
        });                
    });    
    return function() {
        io.close();
    }
});

//SERVER DISCONNECT NOTIFY EVENT
var sourceDisconnect = Rx.Observable.create(function(observer) {
    io.on('connection', function(socket) {                
        socket.on('disconnect', function(data) {
            observer.onNext({'socketId': socket.id, 'event': 'client disconnect'});       
        });
    });    
    return function() {
        io.close();
    }
});

//CONNECT logic handling -> Log user object, update array
var observerConnect = sourceConnect
.subscribe(function(obj) {
    console.log('[SERVER] New client connected! ',  obj.data);                                                       //New client connect Debug MSG
    var socketId = obj.data.socketId;
    usersMap = usersMap.set(socketId, obj.data);
    usersArray = usersMap.toArray();
    //LIMITING logic handling -> limit to 2 players per connection
    if(usersArray.length <= 2){
        io.emit('all users', usersMap.toArray());
        //MATCHMAKING logic handling -> Check if usersArray.length > 1 : Y->Start Game, N->Wait
        if(usersArray.length === 1){
            console.log("[MATCHMAKING] Not enough players to start game, waiting for another player!");
        }else{
            console.log("[MATHCMAKING] Found a group of players, starting game!");
        }
    }else{
        console.log("[SERVER] Rejected connection, lobby is full!");
        usersMap = usersMap.delete(obj.socketId);                                                                   //UPDATE usersMap / DC extra user
    }     
});

//DISCONNECT logic handling -> Log socketID/ user object that disconnected, drop them from array
var observerDisconnect = sourceDisconnect
.subscribe(function(obj) { 
    var socketId = obj.socketId;
    var user = usersMap.get(socketId);
    console.log('[SERVER] Client disconnected! ' + "SOCKET:" + user.socketId, "NICKNAME:" + user.nickname);          //Client DC Debug MSG
    usersMap = usersMap.delete(obj.socketId);
    io.emit('all users', usersMap.toArray());
});

//MESSAGE POST logic handling -> Emit the message, log it in console.
app.post('/message', function(req, res) {
    //Add better debug message parsing here.
    console.log("[MESSAGE LOG] ", req.body);                                                                         //MessageLog Debug MSG
    io.emit('message', req.body);
});




