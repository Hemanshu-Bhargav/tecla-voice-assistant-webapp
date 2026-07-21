const express = require('express');
const path = require('path');
const http = require('http'); //actually used by express under the hood (http.createServer),
//but we need to access it directly for socket.io (and ofc for other projects one would do the same)
const socketio = require('socket.io');

// Output the html, combined with dynamic JS variables from our express framework
const expressLayouts = require('express-ejs-layouts');

const webapp = express();
const server = http.createServer(webapp);
//const io = require('socket.io').listen(server);
//  DON'T USE THIS: //let io = require('socket.io')(server);// This causes different invokation of socket.io so the value of io is different!
//webapp.set("io", io); //to be used by router folder's index.js
const io = socketio(server);
console.log(typeof(io));
//handlebars uses webapp.engine, ejs doesn't
// launch the EJS handlers (templating engine which outputs html pages from expressJS)
webapp.use(expressLayouts);
webapp.set('view engine', 'ejs');

// Body Parser Middleware
webapp.use(express.json());
webapp.use(express.urlencoded({ extended: false })); //set to true to allow % encoding of special characters, see below why its needed even before serializing objects
//some sources say to use false. According to docs, false uses the standard querystring library whereas true uses the qs library (need require line) and can perform
//nested structuring (foo[bar] : bar instead of foo:bar. Basically a nested key.value pair)

// Routing to default directory. Its possible to add other files such as foo.js, etc.
webapp.use('/', require('./routes/index')(io));

// Set static folder
webapp.use(express.static(path.join(__dirname, '/public/')));

//Run when a client connects
//.on lsitens for some event, in this case a connection. To test, click "Join Chat" on homepage (index.html, chat.html is the chatroom)
//and it'll log the msg. If you do nothing, it won't log or emit anything
io.on('connection', socket =>
  {
    console.log('New Websocket Connection...');
    io.emit('message', 'Recording successful');
    //Now, for actual feedback to users, we want a broadcast
    //when a user connects
    //Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat'); // this broadcasts to everyone who joins the chatroom
    //except the user themselves (since they know they just joined the chatroom)
    //socket.emit() emits only to the single client that's connecting (you when you login)
    //to emit to EVERYONE
    //io.emit();

  /* Onclick code. New addition
    socket.on('clicked', function() {
      var button = document.getElementById('button');

      console.log('clicked');
      document.getElementById("alert").innerHTML = "send clicked";

      onClickHandler(button);
    });
    /* End of onclick code */
});
//Whenever running a server, the port # is usually stored in an environment variable. So, check that env variable first for port 5000, and run on that or simply port 5000
const PORT = process.env.PORT || 3000;
//Just logging to tell us the server is indeed running
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
