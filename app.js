
/**
 * Module dependencies.
 */
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
//var redisClient = require('redis').createClient();
var exec = require('child_process').exec;
//var fortunes = require('./scripts/text').fortunes;
var comPort = '/dev/cu.usbmodem411';

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
    console.log('home fetching');
    res.render('index', { title: 'Motor Control' });
});

app.post('/submit', function(req, res){
    var dist = parseInt(req.body.distance, 10);
    var motor = parseInt(req.body.motor, 10);
    if (dist != 0 && Math.abs(dist) < 3000 && (motor == 1 || motor == 2 || motor == 3)) {
      console.log('writing:' + motor + ":" + dist);
      sp.write(motor + ":" + dist + "\n");
    }
    res.send('');
});

app.post('/reset', function(req, res){
    console.log('writing:4:0');
    sp.write("4:0\n");
    res.send('');
});

app.post('/qrreset', function(req, res){
    console.log('writing:5:0');
    sp.write("5:0\n");
    res.send('');
});

app.post('/position', function(req, res){
    var pos = parseInt(req.body.position, 10);
    if (pos >= 0 && pos <= 8) {
      console.log("writing:6:" + pos);
      sp.write("6:" + pos + "\n");
    }
    res.send('');
});

var appServer = http.createServer(app);
/*
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
*/
appServer.listen(app.get('port'));


/*
var io = require('socket.io').listen(appServer);
io.sockets.on('connection', function (socket) {
    socket.log.info('socket connection');
});
*/
/**
 *
 *  Serial port communication
 *
 */

var sp = new SerialPort(comPort, {
  baudrate: 9600
  , parser: serialport.parsers.readline("\n")
});


sp.on("data", function (data) {
    var d = new Date();
    console.log(d.toLocaleString() + " serialData:"+data+':');
});

/*

 List the serial ports available
 */
/*
serialport.list(function (err, ports) {
    ports.forEach(function(port) {
      console.log(port.comName);
      console.log(port.pnpId);
      console.log(port.manufacturer);
    });
  });
*/