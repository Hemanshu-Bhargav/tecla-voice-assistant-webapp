const express = require('express');
const path = require('path');
const http = require('http'); //actually used by express under the hood (http.createServer),

// Output the html, combined with dynamic JS variables from our express framework
const expressLayouts = require('express-ejs-layouts');

const webapp = express();
const server = http.createServer(webapp);

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
webapp.use('/', require('./routes/index'));

// Set static folder
webapp.use(express.static(path.join(__dirname, '/public/')));

//Whenever running a server, the port # is usually stored in an environment variable. So, check that env variable first for port 5000, and run on that or simply port 5000
const PORT = process.env.PORT || 3000;
//Just logging to tell us the server is indeed running
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
