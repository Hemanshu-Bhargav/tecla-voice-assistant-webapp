/*
oldmain.js and its steps to integrate are below. Preceeding content is chatcord stuff removed from layout.EJS
headtag:
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
  integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
  crossorigin="anonymous"
/>
bodytag:

<div class="container">
    <%- body %>
</div>
<div class="chat-container">
  <header class="chat-header">
    <h1><i class="fas fa-smile"></i> ChatCord</h1>
    <!-- IMPORTANT: Fix this in index.js because it is server side. For now, ignore functionality -->
    <a href="index.html" class="btn">Leave Room</a>
  </header>
  <main class="chat-main">
    <div class="chat-sidebar">
      <h3><i class="fas fa-comments"></i> Room Name:</h3>
      <h2 id="room-name"></h2>
      <h3><i class="fas fa-users"></i> Users</h3>
      <ul id="users"></ul>
    </div>
    <div class="chat-messages"></div>
  </main>
  <div class="chat-form-container">
    <form id="chat-form">
      <input
        id="msg"
        type="text"
        placeholder="Enter Message"
        required
        autocomplete="off"
      />
      <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
    </form>
  </div>
</div>
<!-- Use front-end library of socket.io. First line from tutorial didn't work -->
<!-- <script src="./node_modules/socket.io-client/dist/socket.io.js"></script> -->
<script src="/socket.io/socket.io.js"></script>
---------------------------------------------------------------------------------------------------------------------------------------
Steps to Add to main.js
0) Add socket.io lines. MAYBE DO STEP 1 FIRST.
1) Create chat-form and chate-messages equivalents in my welcome.ejs file (since I'm no longer rerouting to a new submit.ejs page, which is what my webapp required, I just needed
to know where I can send the JSON form input (now string cuz of this tutorial) so it can be used a python command line argument when spawning a process. Chat-form is the outer wrapper
and has that id. chat-messages didn't have an ID in Brad's tutorial, doesn't matter, give it an id and replace queryselector or use the queryselector the two times its used in the file
2) Replace the names here and add to index.js

**Might want to create new folder and try without EJS, and just vanilla JS if it doesn't workout! Don't need EJS and don't sulk on lost time or cleaniness, its a big project so
get it working! Start to finish! Need to do iOS integration and update Android as well!!!
---------------------------------------------------------------------------------------------------------------------------------------
*/


//In the declarations below, we're trying to be able to type messages and have them output to the chatroom
//basically form input and output using socket.io
//the form input Brad used had form-id = 'chat-form' (in chat.html under public)
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
//Next go to "Message submit" line


//STEP 1. Can't access io method from chat.html script tag if not initialized!
const socket = io();


//REFRENCED IN SERVER.JS. This is what is being emitted after console.log('New Websocket Connection')
// Message from server (notice everything is a message, joining, form submission, and leaving a room)
socket.on('message', message => {
  console.log(message); //up until here was referenced
  //send message to server so it can later manipulate DOM
  outputMessage(message); //This sends Welcome to ChatCord through function below: Reference "Output message to DOM below" comment.
  //It takes the message as a parameter, creates a div, and outputs it (DON'T NEED THIS FOR EJS. Instead can use <% to reference variable)

  // Scroll down in chatroom on each form submission. This is more of a UI thing, not relevant to my webapp
  chatMessages.scrollTop = chatMessages.scrollHeight; //set scrollTop property to the height, will automatically always scroll down on form submit
});

// Message submit. Listen for submit, which takes arrow fcn. The 'e' is the event parameter. By default, when you submit a form,
//it submits to a file, so we prevent this default behaviour (not rerouting to submit.ejs here
//we don't assign any action= to the chat-form)
chatForm.addEventListener('submit', e => {
  e.preventDefault(); //again prevent cuz not submitting form to another page but to chatroom
  // Get message text (form input. few ways to do it, like grab form DOM, here is one way)
  const msg = e.target.elements.msg.value;
  //console.log(msg); //at this point, form submission doesn't show in chat room, doesn't emit there,
  //but does console log in browser (inspect element ofc)
  // Emit message to server
  socket.emit('chatMessage', msg); //msg is payload. Now, we emit to chatroom
  //NOTE: This isn't enough. To catch that, head over back to server.js to //Listen line
//elements.msg because if you look at chat.html, under formid, <input id='msg' .. and we want the value of that

  // Clear input after form submission
  e.target.elements.msg.value = ''; //Set form bar to nothing, because we want an empty bar and focus on that
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div'); //literally creates a div
  //Notice on chat.html, the div class "chat-messages" is a wrapper for div class = "message"
  //Same thing here (also note 2 <p> for meta and text)
  div.classList.add('message');
  //`` backticks not comma. Note, we only have message as parameter so that's all we can manipulate
  //can't manipulate name or anything like that yet
  //div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  //First had to hardcode until message had additional attributes. Every form submission will say Brad at 7:19pm hardcoded (only form submission itself is dynamic)
  //If you open a new localhost:3000 and login as different user, it'll say "A user has joined" in the chatroom (says user not actual name) from Brad 7:19pm
  //(to all other users, and not the new user ofc. given what we learned about emit vs broadcasr). Will say the same for all rooms
  //To send a JSON object with attributes of time and user (instead of a string), created formatMessage function in messages.js file under newly created (for this purpose!) utils folder
  div.innerHTML = `<p class="meta">Brad<span>7:19pm</span></p>
  <p class="text">
    ${message} //was only {message} before, then line above. This isn't a comment but gets emitted to chatroom alongside Welcome to Chatcord and all messages everytime!
  </p>`;
  //in chat.html we don't have an ID, so can't use document/getElementById('id'), use query selector on chat-messages instead
  document.querySelector('.chat-messages').appendChild(div); //whenever we create a message it should add a new div to this chat-messages
} //  WON'T WORK! I'M USING EJS, NOT VANILLA JS SO CODE NEEDS TO BE IN ROUTES FOLDER
