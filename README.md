turingpoke
==========

After seeing the "TwitchPlaysPokemon" craze on the internet, I decided to implement a simple system that accomplished the same thing but didn't suffer from the imposed stream lag on [TwitchTV](http://twitch.tv). A description of the design and how to setup and run the system can be found below.

## System Overview
The system is composed of four parts. The first is the emulator, for which I chose to use Visual Boy Advance. I ran the emulator as is (with 2x the screen size) on the ROM that we wished to play.

The second part of the system is the stream server. This server is from the jsmpeg project found here: https://github.com/phoboslab/jsmpeg which allows mpeg streams to be displayed in the HTML5 canvas element on a website. 

To generate the stream that the stream server relays to the players, I used ffmpeg with the input source as x11grab. The command I used can be found in the next section.

The last part of the system is the server that serves the page where the stream can be viewed and processes client input for moves. In addition, this simple node.js server executes xdotool commands to send key instructions to the emulator. As we played through a game using this system, more features were added to this server which are outlined in a later section.

## System Setup
Disclaimer: I ran this system on ArchLinux in the Awesome window manager. If you wish to run this on another operating system, you might need to adjust some of the xdotool commands so it can find the window and send keys reliably to the emulator.

You will first need to install, setup, and run Visual Boy Advance on the rom of your choosing. On Archlinux, this is as simple as installing "vbam-gtk" from the official repositories and running ```gvbam [ROM_file]``` from command line.

Next you will need to pull this repo and run ```npm install``` to install the node dependencies.

Once that finishes, run the following:
```
node stream-server.js stream_secret_id
```
(with your own stream_secret_id) to start the streaming server.

Next you will need to start the ffmpeg stream that this server is going to use as an input. This should only require installing ffmpeg. For me, I used the following command:
```
ffmpeg -f x11grab -s 600x300 -show_region 1 -i :0.0 -f mpeg1video -b 600k -r 20 http://localhost:8082/stream_secret_id/600/300/
```
Notice that the stream_secret_id here needs to match the one you used when you started the stream_server.

The last step is to start the poke_server that will interact with the emulator. Before doing this, you will need to change the ip of the stream server in the index.html file so that it accurately refers to the machine that the stream_server is running on. You will need to change this in index.html where you see ```ws://STREAM_SERVER_IP:8084``` and you will want to leave it running on port 8084 and as a websocket.

I required all move requests to send with them a simple code that was validated in poke_server. You will need to inform players of the code that you set in poke_server where you see ```SECRET_CODE```.

After you're done configuring poke_server.js, you can run it with:

```
node poke_server.js
```

At this point, you should move the emulator and console window where you ran poke_server to be within the dotted rectangle that x11grab is streaming. Remember to open the port that poke_server is running on and also port 8084 for the stream.

## Features
As is, the server allows users to type "commands" that are the buttons on a gameboy. It also allows users to prepend a hyphen to commands to interpret them as messages in order to communicate with other players. A list of the current commands is found below:

```
up, u -> press the up button
down, d -> press the down button
right, r -> press the right button
left, l -> press the left button
a -> press the a button
b -> press the b button
start -> press the start button with a configurable probability
start_secret -> press the start button
plzsave -> save the emulator state to disk
```

Later for speed, [Calvin MacKenzie](https://github.com/calvinmm) added immediate keyboard controls that can be added to the page by clicking the button on the index.html page. These allow the arrow keys + z,x or a,b to send controls to the server.

Additionally the game will save the emulator state after a certain number of commands. It does this by using shift+F3 to save to the 3rd save slot and this can easily be changed in poke_server.js to save to any of the slots. A user command of "plzsave" also initiates a save.

