const express = require('express');
const router = express.Router();

/* Welcome Page */
router.get('/', (req, res) => res.render('home'));
router.get('/actionselection', (req, res) => res.render('actionselection'));
router.get('/welcome', (req, res) => res.render('welcome'));
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
    pyarg2 = JSON.stringify(formsubmission.storedhotword.voicetype); //alias for gender
    pyarg3 = JSON.stringify(formsubmission.storedhotword.gain);

    /* Configure Model Name. Has nothing to do with /submitform but ensures that variables get form data from correct scope */
    usermodelname = JSON.parse(pyarg1) + "model.pmdl";
    //Fix double-string type issue after concatentation in usermodelname
    pyarg1 = JSON.parse(pyarg1);
    pyarg2 = JSON.parse(pyarg2);
    pyarg3 = JSON.parse(pyarg3); //Remember to parse pyarg3, 4 etc.
    console.log("Scope check");
    console.log(usermodelname);
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
  console.log(req.body.reqaddseconds);
  console.log("Before command line terminal output");
  var spawn = child_process.spawn('python3', ["./record1.py", pyarg1], {stdio: 'inherit'} );
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
  var spawn = child_process.spawn('python3', ["./record2.py", pyarg1], {stdio: 'inherit'} );
  res.render('recordingpage2');
});

/*Record 3rd Sample*/
router.get('/recordingpage3', (req,res) => res.render('recordingpage3')); //let recordingsuccess = {};
router.post('/recordingpage3', function(req,res)
{
  var child_process = require('child_process');
  console.log("Before command line terminal output");
  var spawn = child_process.spawn('python3', ["./record3.py", pyarg1], {stdio: 'inherit'} );
  res.render('recordingpage3');
});
/* Function to send live python bash output from raspberyy pi to node. Terminal output is Asynchronous */
function run_script(child, command, args, callback)
{
  // This function will output the lines from the script
  // AS is runs, AND will return the full combined output
  // as well as exit code when it's done (using the callback).
    //DOESN'T WORK//var child = processtospawn;
    console.log("Starting Process.");
    var scriptOutput = "";

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
        console.log('stderr: ' + data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.on('close', function(code) {
        callback(scriptOutput,code);
    });
}
/* Send to Training Service & Create Personal Model */
router.get('/modelcreation', function(req,res)
{
    console.log ("Continuing to do node things while the process runs at the same time...");
    var child_process = require('child_process');
    var child = child_process.spawn('python3', ["./training_service.py", pyarg1, pyarg2, usermodelname],{stdio: 'inherit'});
    console.log("Before command line terminal output");
  //  sendterminaloutput = {};
    res.render('modelcreation');
    /*
    run_script(child,"ls", ["-l", "/home"], function(output, exit_code) {
        console.log("Output sent to website. Exit code:" + exit_code);
        outputstr = output;
        sendterminaloutput = {modeloutput: outputstr};
      //  res.render('modelcreation', sendterminaloutput);
    });
    */
});

//The 3 recording buttons above have already generated the audio files 1.wav, 2.wav and 3.wav
/* Navigate back to step 1 */
//repeat all steps to create another personal model

/* Listen for personal models */
router.get('/listenformodels', (req,res) => res.render('listenformodels'));
router.post('/listenformodels', function(req,res)
{

  console.log ("Continuing to do node things while the process runs at the same time...");
  var child_process = require('child_process');
//  var child = child_process.spawn('python3', ["./serverinputsnowboymultiple.py"],{stdio: ['inherit', 'pipe', 'pipe']});
var child = child_process.spawn('python3', ["./serverinputsnowboymultiple.py"],{stdio: 'inherit'});
  console.log("Before command line terminal output");
  /*
  const output = [];

  child.stdout.on('data', d => {
    console.log(d.toString());
    output.push(d.toString());
  });

  child.stdout.on('end', () => {
    console.log('Finished');
    console.log({ output });
  });
  */
  res.render('listenformodels'); //,output);
  /*
  sendterminaloutput1 = {};

  run_script(child,"ls", ["-l", "/home"], function(output, exit_code)
  {
      console.log("Output sent to website. Exit code:" + exit_code);
      outputstr1 = output;
      sendterminaloutput1 = {modeloutput1: outputstr1};
      res.render('listenformodels', sendterminaloutput1);
  });
});
  /*
  var child_process = require('child_process');
  listenformodelsoutput = {};
  listenformodelsoutput2 = {};
  console.log("Node Version: ", process.version);

  // This function will output the lines from the script
  // AS is runs, AND will return the full combined output
  // as well as exit code when it's done (using the callback).
  function run_script1(command, args, callback) {
      console.log("Starting Process.");
      var child = child_process.spawn('python3', ["./serverinputsnowboymultiple.py"]);

      var scriptOutput = "";

      child.stdout.setEncoding('utf8');
      child.stdout.on('data', function(data) {
          console.log('stdout: ' + data);

          data=data.toString();
          scriptOutput+=data;
      });

      child.stderr.setEncoding('utf8');
      child.stderr.on('data', function(data) {
          console.log('stderr: ' + data);

          data=data.toString();
          scriptOutput+=data;
      });

      child.on('close', function(code) {
          callback(scriptOutput,code);
      });
      return scriptOutput;
  }
  run_script1("ls", ["-l", "/home"], function(output, exit_code) {
      console.log("Process Finished.");
      console.log('closing code: ' + exit_code);
      console.log('Full output of script: ',output);
      outputstr = output;
      listenformodelsloutput2 = {modelout2: outputstr};
  });

  console.log ("Continuing to do node things while the process runs at the same time...");
  listenformodelsloutput = {modelout: scriptOutput};

  res.render('listenformodels', listenformodelsoutput, listenformodelsoutput2);
*/
});

module.exports = router;
