const express = require('express');
const router = express.Router();

var io = require('socket.io').listen(5000);

io.sockets.on('connection', function (socket) {
    socket.on('myClick', function (data) {
        socket.broadcast.emit('myClick', data);
    });
});

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));
router.get('/submitform', (req,res) => res.render('submitform'))
// After Form Submission
router.post('/submitform', function(req, res) //,next
  {
    //const parsedbody = {};
    //const formsubmission = JSON.stringify(req.body);
    //parsedbody[formsubmission] = formsubmission;
    //const formsubmission = req.body.email;
    //const {name} = req.body;
    //const parsedbody = JSON.stringify(req.body);
    const formsubmission = { storedhotword: req.body } // --> sent this variable as JSON.stringify(storedhotword.name)
    //storedhotword itself is JSON ({"name":"Jack"}) and storedhotword.name is a string ("Jack")
    //python command-line argument
    var pyarg1 = JSON.stringify(formsubmission.storedhotword.hotword); //data is a nested JSON variable
    //next(); //Sometimes results in setting HTTP headers after code is in finished state
    console.log(pyarg1);

    var child_process = require('child_process');
    console.log("Before command line terminal output");

    var spawn = child_process.spawn('python', ["./record.py", pyarg1], {stdio: 'inherit'} );
    res.render('submitform', formsubmission);
  /*  spawn.stdout.on('data', function(data)
    {
      res.send(data.toString());
    //  const data = data.toString();
    //  res.render("submitform", formsubmission, data) ;
    //    sys.stdout.flush();
  }) */
});

module.exports = router;
