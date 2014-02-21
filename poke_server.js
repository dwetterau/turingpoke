var express = require('express');
var app = express();

var FFI = require("node-ffi");                                                  
var libc = new FFI.Library(null, {                                              
  "system": ["int32", ["string"]]                                               
}); 

var clc = require('cli-color');
                                                                                 
var run = libc.system;    
run('xdotool search --onlyvisible --name VBA-M windowactivate');

var START_P = .2;
var MOVES_PER_SAVE = 300;
var cur_move = 0;

function controlGame(name, command) {
  command = command.toLowerCase();
  var display = true;
  switch(command) {
    case 'plzsave':
      run('xdotool keydown --delay 0 shift+F3 sleep 0.1 keyup --delay 0 shift+F3');
      console.log(clc.red.bold("SAVING GAME STATE!"));
      display = false;
      break;     
    case 'up':
      run('xdotool keydown --delay 0 w sleep 0.1 keyup --delay 0 w');
      break;
    case 'down':
      run('xdotool keydown --delay 0 s sleep 0.1 keyup --delay 0 s');
      break;
    case 'left':
      run('xdotool keydown --delay 0 a sleep 0.1 keyup --delay 0 a');
      break;
    case 'right':
      run('xdotool keydown --delay 0 d sleep 0.1 keyup --delay 0 d');
      break;
    case 'a':
      run('xdotool keydown --delay 0 q sleep 0.1 keyup --delay 0 q');
      break;
    case 'b':
      run('xdotool keydown --delay 0 e sleep 0.1 keyup --delay 0 e');
      break;
    case 'start':
      // Sigh... silly people
      if (Math.random() < START_P) {
        run('xdotool keydown --delay 0 x sleep 0.1 keyup --delay 0 x');
      }
      break;
    default: 
      display = false;
  }
  if (display) {
    console.log(name, "-", command);
  }
}

function displayChat(name, message) {
  console.log(clc.yellow.bold(name + " - " + message));
}

app.use(express.bodyParser());
app.use('/', express.static(__dirname + '/'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server listening on", port);
});

app.post('/command', function(req, res) {
  if (!req.body.data || 
      !req.body.data.command || 
      !req.body.data.name ||
      req.body.data.code !== 'salmonchase2') {
    res.send(401);
    return;
  }
  var name = req.body.data.name;
  if (!typeof name === "string" || name.length > 20) {
    res.send(401);
    return;
  }
  var command = req.body.data.command;
  if (!typeof command === "string" || command.length > 100) {
    res.send(401);
    return;
  }
  if (cur_move % MOVES_PER_SAVE == 0) {
    controlGame("master", "plzsave");
  }
  if (command[0] == '-') {
    displayChat(name, command.slice(1));
  } else {
    controlGame(name, command);
    cur_move++;
  }  
  res.send(200);
});
