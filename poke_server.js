var express = require('express');
var app = express();

var FFI = require("node-ffi");                                                  
var libc = new FFI.Library(null, {                                              
  "system": ["int32", ["string"]]                                               
});                                                                             
                                                                                 
var run = libc.system;    
run('xdotool search --onlyvisible --name VBA-M windowactivate');

function controlGame(name, command) {
  command = command.toLowerCase();
  var display = true;
  switch(command) {
    case 'up', 'u':
      run('xdotool keydown --delay 0 w sleep 0.1 keyup --delay 0 w');
      break;
    case 'down', 'd':
      run('xdotool keydown --delay 0 s sleep 0.1 keyup --delay 0 s');
      break;
    case 'left', 'l':
      run('xdotool keydown --delay 0 a sleep 0.1 keyup --delay 0 a');
      break;
    case 'right', 'r':
      run('xdotool keydown --delay 0 d sleep 0.1 keyup --delay 0 d');
      break;
    case 'a':
      run('xdotool keydown --delay 0 q sleep 0.1 keyup --delay 0 q');
      break;
    case 'b':
      run('xdotool keydown --delay 0 e sleep 0.1 keyup --delay 0 e');
      break;
    case 'start':
      run('xdotool keydown --delay 0 x sleep 0.1 keyup --delay 0 x');
      break;
    default:
      display = false;
  }
  if (display) {
    console.log(name, "-", command);
  }
  else {
    console.log(name, ":", command);
  }
}

app.use(express.bodyParser());
app.use('/', express.static(__dirname + '/'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server listening on", port);
});

app.post('/command', function(req, res) {
  if (req.body.data.code !== 'salmonchase') {
    res.send(401);
    return;
  }
  controlGame(req.body.data.name, req.body.data.command);
  res.send(200);
});
