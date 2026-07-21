const express = require('express');
const router = express.Router();

/* Welcome Page */
router.get('/', (req, res) => res.render('welcome'));
router.get('/submitform', (req, res) => res.render('submitform'))
//form output is saved to this variable and will be global. On form input (from router.post),the variable will be reassigned
//Variables declared without var/let/const are global. Not the best practice but these names won't be re-used
formsubmission = {};
pyarg1 = JSON.stringify(formsubmission);
pyarg2 = JSON.stringify(formsubmission);
usermodelname = "";
/* After Form Submission */
router.post('/submitform', function(req, res) //,next
  {
    formsubmission = { storedhotword: req.body }; // --> sent this variable as JSON.stringify(storedhotword.name)
    //storedhotword itself is JSON ({"name":"Jack"}) and storedhotword.name is a string ("Jack")
    res.render('submitform', formsubmission);
    pyarg1 = JSON.stringify(formsubmission.storedhotword.hotword); //data is a nested JSON variable
    pyarg2 = JSON.stringify(formsubmission.storedhotword.voicetype);

    /* Configure Model Name. Has nothing to do with /submitform but ensures that variables get form data from correct scope */
    usermodelname = JSON.parse(pyarg1) + "_model.pmdl";
    //Fix double-string type issue after concatentation in usermodelname
    pyarg1 = JSON.parse(pyarg1);
    pyarg2 = JSON.parse(pyarg2);
    console.log("Scope check");
    console.log(pyarg1, pyarg2, usermodelname);
});

//Command-line arguments for spawned python processes. These comprise of req.body.
// 1) Recording process arguments
// 2) Training Service Command-line arguments. These are generated from the spawned recording processes.
// 3) Snowboy Multiple-model Listener command-line arguments.

/*Record 1st Sample*/
router.get('/recordingpage1', (req,res) => res.render('recordingpage1')); //let recordingsuccess = {};
router.post('/recordingpage1', function(req,res)
{
  console.log(pyarg1); //Check if scope is intact
  var child_process = require('child_process');
  console.log("Before command line terminal output");
  var spawn = child_process.spawn('python', ["./record1.py", pyarg1], {stdio: 'inherit'} );
  //   recordingsuccess = {msgalert: "Sample Recorded!"};
  res.render('recordingpage1');
  //  res.send("Ajax works with nodejs and so does spawning process. Just got to fix json strings (already did that!)");
});

/*Record 2nd Sample*/
router.get('/recordingpage2', (req,res) => res.render('recordingpage2')); //let recordingsuccess = {};
router.post('/recordingpage2', function(req,res)
{
  var child_process = require('child_process');
  console.log("Before command line terminal output");
  var spawn = child_process.spawn('python', ["./record2.py", pyarg1], {stdio: 'inherit'} );
  res.render('recordingpage2');
});

/*Record 3rd Sample*/
router.get('/recordingpage3', (req,res) => res.render('recordingpage3')); //let recordingsuccess = {};
router.post('/recordingpage3', function(req,res)
{
  var child_process = require('child_process');
  console.log("Before command line terminal output");
  var spawn = child_process.spawn('python', ["./record3.py", pyarg1], {stdio: 'inherit'} );
  res.render('recordingpage3');
});

/* Send to Training Service & Create Personal Model */
router.get('/modelcreation', function(req,res)
{
  var child_process = require('child_process');
  console.log("Before command line terminal output");
  var spawn = child_process.spawn('python', ["./training_service.py", pyarg1, pyarg2, usermodelname], {stdio: 'inherit'} );
  res.render('modelcreation');
});

//The 3 recording buttons above have already generated the audio files 1.wav, 2.wav and 3.wav
/* Navigate back to step 1 */
//repeat all steps to create another personal model

/* Listen for personal models */
module.exports = router;
