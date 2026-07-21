const express = require('express');
module.exports = function(io) {
  console.log(typeof(io));
  //console.log(io);
  let router = express.Router();
  // //let io = router.get("io"); //const socket = io('http://localhost:5000');
//  const socket = io();
  // Welcome Page
  router.get('/', (req, res) => res.render('welcome'));
  //form output is saved to this variable and will be global. On form input (from router.post),
  //the variable will be reassigned
  router.get('/submitform', (req, res) => res.render('submitform'))
  let formsubmission = {};
  // After Form Submission
  router.post('/submitform', function(req, res) //,next
    {
      formsubmission = { storedhotword: req.body } // --> sent this variable as JSON.stringify(storedhotword.name)
      //storedhotword itself is JSON ({"name":"Jack"}) and storedhotword.name is a string ("Jack")
      res.render('submitform', formsubmission);
  });
  router.get('/recordingpage', (req,res) => res.render('recordingpage'));
  let recordingsuccess = {};
  router.post('/recordingpage', function(req,res)
  {
    var pyarg1 = JSON.stringify(formsubmission.storedhotword.hotword); //data is a nested JSON variable
    console.log("SCOPE WORKS");
    console.log(pyarg1);
    var child_process = require('child_process');
    console.log("Before command line terminal output");
    var spawn = child_process.spawn('python', ["./record.py", pyarg1], {stdio: 'inherit'} );
    recordingsuccess = {recordingsuccess: "Sample Recorded!"};
    res.render('recordingpage', JSON.stringify(recordingsuccess));
  });
  /*When recording buttons are clicked, spawn process and emit recording successful message
  io.sockets.on('connection', function (socket) {
      socket.on('record1', function (data) {
        console.log("Recording successful");
          socket.broadcast.emit('Recording successful', data);
      });
  }); */
/*
  socket.on('message', message => {
    console.log(message); //up until here was referenced
    //send message to server so it can later manipulate DOM
    outputMessage(message); //This sends Welcome to ChatCord through function below: Reference "Output message to DOM below" comment.
    //It takes the message as a parameter, creates a div, and outputs it (DON'T NEED THIS FOR EJS. Instead can use <% to reference variable)
    // Output message to DOM
  /*  function outputMessage(message)
    {
      const div = document.createElement('div'); //literally creates a div
      div.classList.add('message');
      div.innerHTML = `<p class="meta">Is<span>this working?</span></p>
      <p class="text">
        ${message}
      </p>`;
      //we don't have an ID, so can't use document/getElementById('id'), use query selector for class instead
      document.querySelector('.record1div').appendChild(div); //whenever we create a message it should append div
    } */
//  });
  //module.exports = router;
    return router;
}
