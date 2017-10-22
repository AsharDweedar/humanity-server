var express = require('express');
const app = express();

var morgan = require('morgan'); //display req in terminal ..
app.use(morgan('dev'));

//APIs request , if needed
var request = require('request'); 

//read req body data 
var bodyParser = require('body-parser');  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//passwords in/de-crypting ..
//import bcrypt = require('bcrypt'; 

//for log-in/out sessions
var session = require('express-session'); 
app.use(session({
    secret: "ptb",
    resave: true,
    saveUninitialized: true
}));

//for sessions
var cookieParser = require('cookie-parser'); 
app.use(cookieParser());

// Add headers
app.use(function (req, res, next) {

   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', '*');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', '*');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);

   // Pass to next layer of middleware
   next();
});

/***************************************************
main page 
**************************************************/

app.get('/', (req, res) => {
  res.send('i have nothing to the main page ammar !!!');
})

/***************************************************

//users router from here

**************************************************/

var usersRouter = require('./usersRoute.js');
app.get('/users', (req, res) => {
  usersRouter['get']['/'](req, res, (done, users) => {
    res.status(done ? ((users.length) ? 302 : 404 ) : 500);
    //302 : found , 404 : not found, 500 : intrnal server error
    res.send(users);
  });
})
app.get('/users/signout', (req, res) => {
  console.log('signing out for : ', req.session.username)
  if (req.session.username) {
    usersRouter['get']['/signout'](req, res, (done) => {
      res.status(done ? 202 : 501); 
      //202 : accepted , 501 : internal server error => not implemented
      res.send({"done" : done});
    });
  } else {
    res.status(400);
    //400 : bad request ... there is no session to destoy
    res.send({"done" : false});
  }
})
app.get('/users/userinfo', (req, res) => {
  if (!req.session.username) {
    res.status(400);//400 : bad request
    return res.send({});
  } 
  usersRouter['get']['/userinfo'](req, res, (data) => {
    res.send(data);
  });
})
app.post('/users/signin', (req, res) => {
  usersRouter['post']['/signin'](req, res, (done) => {
    //create the session here ....
    if (done) {
      req.session.username = req.body.username;
      req.session.password = req.body.password;
      req.session.type = "user";
      console.log('session : ', req.session);
      res.send({"done" : true , "type" : "user"});
    } else {
      res.send({"done" : false});
    }
  });
});
app.post('/users/signup', (req, res) => {
  console.log('inside server .. redirecting to ordered route ..');
  usersRouter['post']['/signup'](req, res, (done, message) => {
    res.status(done ? 201 : 400);
    //201 : created , 400 : bad request
    res.send({message : message});
  });
});


/***************************************************

orgs router from here

**************************************************/


var orgsRouter = require('./orgsRoute.js');
app.get('/orgs', (req, res) => {
  orgsRouter['get']['/'](req, res, (done, orgs) => {
    res.status(done ? ((orgs.length) ? 302 : 404 ) : 500);
    //302 : found , 404 : not found, 500 : intrnal server error
    res.send(orgs);
  });
})
app.get('/orgs/signout', (req, res) => {
  console.log('signing out for : ', req.session.username)
  if (req.session.username) {
    orgsRouter['get']['/signout'](req, res, (done) => {
      res.status(done ? 202 : 501); 
      //202 : accepted , 501 : internal server error => not implemented
      res.send({"done" : done});
    });
  } else {
    res.status(400);
    //400 : bad request ... there is no session to destoy
    res.send({"done" : false});
  }
});
app.get('/orgs/orginfo', (req, res) => {
  if (!req.session.username) {
    res.status(400);//400 : bad request
    return res.send({});
  } 
  orgsRouter['get']['/orginfo'](req, res, (data) => {
    res.send(data);
  });
});
app.post('/orgs/signin', (req, res) => {
  orgsRouter['post']['/signin'](req, res, (data) => {
    //create the session here ....
    if (data) {
      req.session.username = req.body.name;
      req.session.password = req.body.password;
      req.session.type = "org";
      console.log('session : ', req.session);
      res.send({"done" : true , "type" : "org"});
    } else {
      res.send({"done" : false});
    }
  });
});
app.post('/orgs/signup', (req, res) => {
  orgsRouter['post']['/signup'](req, res, (done, message) => {
    res.status(done ? 201 : 400);
    //201 : created , 400 : bad request
    res.send({message : message});
  });
});


/***************************************************

events router from here

**************************************************/

var eventsRouter = require('./eventsRoute.js');
app.get('/events', (req, res) => {
  eventsRouter['get']['/'](req, res, (done, events) => {
    res.status(done ? ((events.length) ? 302 : 404 ) : 500);
    if (done) console.log('found : ' + events.length + ' events !!!!');
    //302 : found , 404 : not found, 500 : intrnal server error
    res.send(events);
  });
})
app.post('/events/create', (req, res) => {
  if (req.session.type !== "org") {
    res.status(401); //401 : un authrized ...
    console.log('un authrized user to create event .....');
    return res.send({message : "sign in as organisation first !!"})
  }
  eventsRouter['post']['/create'](req, res, (done, message) => {
    res.status(done ? 201 : 400);
    res.send({message : message});
  });
});


/***************************************************

server 

**************************************************/


var port = process.env.PORT || 3336
var listener = app.listen(port , () => {
	const { address, port } = listener.address();
	console.log(`listining on http://${address}:${port}`);
});


