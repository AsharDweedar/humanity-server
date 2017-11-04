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

/************************************************/
/*************    users router  *****************/
/*************     from here    *****************/
/************************************************/

var usersRouter = require('./usersRoute.js');
app.get('/users', (req, res) => {
  usersRouter['get']['/'](req, res, (done, users, m) => {
    res.status(done ? ((users.length) ? 302 : 404 ) : 500);
    //302 : found , 404 : not found, 500 : intrnal server error
    res.send(users);
  });
});

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
});

app.get('/users/userinfo', (req, res) => {
  if (!req.session.username) {
    res.status(401);//401 : not authrised
    return res.send({"found" : false , "message" : "not signed in"});
  } 
  usersRouter['get']['/userinfo'](req, res, (done, user, m) => {
    var st = done ? (user !== null ? 302 : 404) : 500;
    //302 : found , 404 : not found ,500 : internal server error
    res.status(st);
    res.send({ "found": done, "user": user, "message": m })
  });
});

app.post('/users/signin', (req, res) => {
  if (!!req.session.username) {
    res.status(400); //401 : un authrized ...
    console.log('already signed in for : ' + req.session.username);
    return res.send({"message" : "already signed in"})
  }
  usersRouter['post']['/signin'](req, res, (info) => {
    //create the session here ....
    if (!!info.username) {
      console.log(`signing in for : ${info.username}`);
      req.session.username = info.username;
      req.session.userid = info.id;
      req.session.age = info.age;
      req.session.type = "user";
      console.log('session : ', req.session);
    }
    res.send(info);
  });
});

app.post('/users/signup', (req, res) => {
  console.log('inside server .. redirecting to ordered route ..');
  usersRouter['post']['/signup'](req, res, (done, message, missing) => {
    res.status(done ? 201 : 400);
    //201 : created , 400 : bad request
    var obj = {message : message}
    obj.saved = done ;
    obj.missing = missing;
    res.send(obj);
  });
});

app.post('/users/userbyid', (req, res) => {
  if (!req.body.user_id) {
    res.status(400);
    console.log('find user for the id : ');
    console.log(req.body);
    return res.send({"error" : "send user_id please"});
  }
  usersRouter['post']['/userbyid'](req, res, (done, data) => {
    console.log("user by id : ", data.name);
    return !done ? res.send({"error" : data}) : res.send({"user" : data});
  });
});

app.post('/users/voteuser', (req, res) => {
  if (!req.session && !req.session.type === 'org') {
    return res.send({"done" : false, "message" : "please sign in as org first !!"});
  }
  usersRouter["post"]["/voteuser"](req, res, (done, data, message) => {
     var st = done ? (data !== null ? 200 : 400) : 500;
     //200 : ok , 400 : bad request,500 : internal server error
     console.log(message);
     res.status(st);
  });
});

app.put('/users/editprofile', (req, res) => {
  if (!req.session && !req.session.username) {
    res.status(401); // 401 : not authorized
    return res.send({"done" : false , "message" : "not signed in as user"});
  }
  usersRouter['put']['/editprofile'](req, res, (done, data, message) => {
    console.log('recieved from routers : ',done );
    var st = done ? (data !== null ? 200 : 400) : 500;
    //200 : ok , 400 : bad request,500 : internal server error
    console.log(message);
    res.status(st);
    res.send({"done": done, "data": data, "message": message});
  });
});

app.delete("/users/deletemyaccount", (req, res) => {
  if (!req.session && !req.session.username) {
    res.status(401); //401 : not authrised
    return res.send({ found: false, message: "not signed in" });
  }
  usersRouter["delete"]["/deletemyaccount"](req, res, (done, err) => {
    res.status(done ? 202 : 500); //202 : accepted , 500 :server err
    res.send(done ? { done: done } : { error: error });
  });
});


/***************************************************

orgs router from here

**************************************************/


var orgsRouter = require('./orgsRoute.js');
app.get('/orgs', (req, res) => {
  orgsRouter['get']['/'](req, res, (done, orgs,m) => {
    res.status(done ? ((orgs.length) ? 302 : 404 ) : 500);
    //302 : found , 404 : not found, 500 : intrnal server error
    res.send(orgs);
  });
});

app.get('/orgs/signout', (req, res) => {
  console.log('signing out for : ', req.session.name)
  if (req.session.name) {
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
  if (!req.session || !req.session.name) {
    res.status(400);//400 : bad request
    return res.send({"found" : false , "message" : "not signed in"});
  } 
  orgsRouter['get']['/orginfo'](req, res, (done, org, m) => {
    var st = done ? (org !== null ? 302 : 404 ) : 500 ;
    //302 : found , 404 : not found ,500 : internal server error
    res.status(st);
    res.send({ "found": done, "org": org, "message" : m})
  });
});

app.post('/orgs/signin', (req, res) => {
  if (!!req.session.name) {
    res.status(400); //401 : un authrized ...
    console.log('already signed in for : ' + req.session.name);
    return res.send({"message" : "already signed in"})
  }
  orgsRouter['post']['/signin'](req, res, (info) => {
    //create the session here ....
    console.log(`signing in for : ${info.name}`);
    if (!!info.name) {
      req.session.name = info.name;
      req.session.orgid = info.id;
      req.session.type = "org";
      console.log('session : ', req.session);
    }
    res.send(info);
  });
});

app.post('/orgs/signup', (req, res) => {
  orgsRouter['post']['/signup'](req, res, (done, message, missing) => {
    res.status(done ? 201 : 400);
    //201 : created , 400 : bad request
    var obj = {message : message}
    obj.saved = done ;
    obj.missing = missing;
    res.send(obj);
  });
});

app.post('/orgs/orgbyid', (req, res) => {
  if (!req.body.org_id) {
    res.status(400);
    console.log('find org (bad request) for the body : ');
    console.log(req.body);
    return res.send({"error" : "send org_id please"});
  }
  orgsRouter['post']['/orgbyid'](req, res, (done, data, message) => {
    var st = done ? (org !== null ? 302 : 404) : 500;
    //302 : found , 404 : not found ,500 : internal server error
    res.status(st);
    res.send({ found: done, org: org, message: m });
  });
});

app.put("/orgs/editprofile", (req, res) => {
  if (!req.session && !req.session.name) {
    res.status(401); // 401 : not authorized
    return res.send({ done: false, message: "not signed in as org" });
  }
  orgsRouter["put"]["/editprofile"](req, res, (done, data, message) => {
    console.log("recieved from routers 'orgs/editprofile' : ", done);
    var st = done ? (data !== null ? 202 : 400) : 500;
    //200 : ok , 400 : bad request,500 : internal server error
    console.log(message);
    res.status(st);
    res.send({ done: done, data: data, message: message });
  });
});

app.delete('/orgs/deletemyaccount', (req, res) => {
  orgsRouter["delete"]['/deletemyaccount'](req, res, (done, err) => {
    res.status(done ? 202 : 500); //202 : accepted , 500 :server err
    res.send({"done" : done , "error" : err});
  })
});

/***************************************************

events router from here

**************************************************/

var eventsRouter = require('./eventsRoute.js');

app.get('/events', (req, res) => {
  eventsRouter['get']['/'](req, res, (done, events) => {
    res.status(done ? ((events.length) ? 302 : 404 ) : 500);
    //302 : found , 404 : not found, 500 : intrnal server error
    if (done) console.log('found : ' + events.length + ' events !!!!');
    res.send(events);
  });
});

app.get('/events/orgevents', (req, res) => {
  var re = {};
  if (!req.session.name) {
    res.status(400);
    re.found = false;
    re.message = "sign in first";
    return res.send(re);
  } 
  eventsRouter['get']['/orgevents'](req, res, (done, events, m) => {
    res.status(done ? ((events.length) ? 302 : 404 ) : 500);
    //302 : found , 404 : not found, 500 : intrnal server error
    re = (events.length) ? { events : events} : {message : m}; 
    res.send(re);
  });
});

app.get('/events/userevents', (req, res) => {
  var re = {};
  if (!req.session.username) {
    res.status(400); //400: bad request
    re.found = false;
    re.message = "sign in first";
    return res.send(re);
  } 
  eventsRouter['get']['/userevents'](req, res, (done, events , m) => {
    res.status(done ? ((events.length) ? 302 : 404 ) : 500);
    //302 : found , 404 : not found, 500 : intrnal server error
    done ? re.events = events : re.message = m ; 
    console.log(re);
    res.send(re);
  });
});

app.post('/events/create', (req, res) => {
  if (!req.session && req.session.type !== "org") {
    res.status(401); //401 : un authrized ...
    console.log('un authrized user to create event .....');
    return res.send({message : "sign in as organisation first !!"})
  }
  eventsRouter['post']['/create'](req, res, (done, message) => {
    res.status(done ? 201 : 400); //201: created , 400 : bad request
    res.send({"message" : message});
  });
});

app.post('/events/join', (req, res) => {
  if (!req.session && !req.session.username) {
    res.status(401); //401 : un authrized ...
    console.log('un authrized user to join event .....', req.session);
    return res.send({"done" : false , "message" : "sign in as user first !!"})
  }
  eventsRouter['post']['/join'](req, res, (done, message) => {
    console.log(done, message)
    console.log('done, message')
    res.send({"done" : done , "message" : message});
  });
});

app.post('/events/vote', (req, res) => {
  if (!req.session && !req.session.username) {
    res.status(401); //401 : un authrized ...
    console.log("trying to vote Event event .....", req.session);
    return res.send({ done: false, message: "sign in as user first !!" });
  }
  eventsRouter["post"]["/vote"](req, res, (done, data, message) => {
    res.send({ done: done, message: message, data: data });
  });
});

app.post('/events/bytime', (req, res) => {
  eventsRouter['post']['/bytime'](req, res, (done, events, message) => {
    res.status(done ? ((events.length) ? 302 : 404 ) : 500);
    //302 : found , 404 : not found, 500 : intrnal server error
    res.send({"done" : done , "events": events,"message" : message});
  });
});

app.post('/events/bylocation', (req, res) => {
  eventsRouter['post']['/bylocation'](req, res, (done, events, message) => {
    res.status(done ? ((events.length) ? 302 : 404 ) : 500);
    //302 : found , 404 : not found, 500 : intrnal server error
    res.send({"done" : done , "events": events,"message" : message});
  });
});

app.post("/events/eventusers", (req, res) => {
  if (!req.body.id) {
    res.status(400);
    console.log("find org (bad request) for the body : ");
    console.log(req.body);
    return res.send({ error: "send event id please" });
  }
  eventsRouter["post"]["/eventusers"](req, res, (done, users, m) => {
    console.log("users found  : ", users.length);
    var st = done ? (users !== null ? 302 : 404) : 500;
    //302 : found , 404 : not found ,500 : internal server error
    res.status(st);
    res.send({ found: done, users: users, message: m });
  });
});

app.put('/events/updateevent', (req, res) => {
  if (!req.session && req.session.type !== "org") {
    res.status(401); //401 : un authrized ...
    console.log("un authrized user to create event .....");
    return res.send({ message: "sign in as organisation first !!" });
  }
  eventsRouter["post"]["/updateevent"](req, res, (done, event, message) => {
    res.status(done ? 200 : 400); //200 : ok , 400 : bad request
    res.send({"done": done, "event": event, "message": message});
  });
});

app.delete('/events/deleteevent', (req, res) => {
  if (!req.session || (req.session && req.session.type !== "org")) {
    res.status(401); //401 : un authrized ...
    console.log('un authrized user to create event .....');
    return res.send({message : "sign in as organisation first !!"})
  }
  eventsRouter["delete"]['/deleteevent'](req, res, (done, message) => {
    res.status(done ? 201 : 400);//201: created , 400 : bad request
    res.send({"done" : done , "message" : message});
  });
});

app.delete("/events/unjoin", (req, res) => {
  if (!req.session && !req.session.username) {
    res.status(401); //401 : un authrized ...
    console.log("un authrized user to un-join event .....", req.session);
    return res.send({ done: false, message: "sign in as user first !!" });
  }
  eventsRouter["delete"]["/unjoin"](req, res, (done, message) => {
    res.send({ done: done, message: message });
  });
});

/***************************************************

admin

**************************************************/

var adminRouter = require('./adminRoute.js');

app.post('/admin/deleteEvent', (req, res) => {
  adminRouter['/deleteEvent'](req, res, (done, message) => {
    res.send({"done" : done , "message" : message});
  });
});

app.post('/admin/createEvent', (req, res) => {
  adminRouter['/createEvent'](req, res, (done, message) => {
    res.status(done ? 201 : 400); //400 : bad req , 201 : created
    res.send({"message" : message});
  });
});


app.post('/admin/deleteorg', (req, res) => {
  adminRouter['/deleteorg'](req, res, (done, err) => {
    res.status(done ? 202 : 500); //202 : accepted , 500 :server err
    res.send(done ? { "done": done } : { "error": error });
  })
});

app.post('/admin/deleteuser', (req, res) => {
  adminRouter['/deleteuser'](req, res, (done, err) => {
    res.status(done ? 202 : 500); //202 : accepted , 500 :server err
    res.send(done ? { "done": done } : { "error": err });
  });
});


/***************************************************

common 

**************************************************/

var utils = require('./utils.js');

app.get('/isLoggedIn', (req, res) => {
  var obj = {}
  if (!req.session && !req.session || !req.session.type) {
    obj.isLoggedIn = false;
    obj.type = "";
    return res.send(obj);
  }
  obj.isLoggedIn = true;
  if (req.session.type === "org") {
    obj.type = "org";
    utils.findOrgWhere({where: {name: req.session.name}}, (found, [dbOrg]) => {
      if (found) {
        utils.findOrgEvents(dbOrg.id , (done, evArr, m) => {
          if (done) {
            dbOrg.setDataValue ('events', evArr);
          } 
          obj.data = dbOrg.dataValues;
          res.send(obj);
        })
      } else {
        res.status(500); //500 : server error
        res.send(obj);
      }
    });
  }
  if (req.session.type === "user") {
    obj.type = "user";
    utils.findUserWhere({where: {username: req.session.username}}, (found, [dbUser]) => {
      if (found) {
        utils.findUserEvents(dbUser.id , (done, evArr, m) => {
          if (done) {
            dbUser.setDataValue ('events', evArr);
          } 
          obj.data = dbUser.dataValues;
          res.send(obj);
        })
      } else {
        res.status(500); //500 : server error
        res.send(obj);
      }
    });
  }
});

/************************************************************/

var port = process.env.PORT || 3336
var listener = app.listen(port , () => {
	const { address, port } = listener.address();
	console.log(`listining on http://${address}:${port}`);
});


module.exports = app;