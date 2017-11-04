
//import db tables ....
const Events = require('../database/comp/events.js');
const OrgsEvents = require('../database/comp/orgsevents.js');
const Users = require('../database/comp/users.js');
const Orgs = require('../database/comp/orgs.js');


/************************************************/
/*************                  *****************/
/*************     users        *****************/
/*************                  *****************/
/************************************************/


var findUserWhere = (query , cb) => {
  Users.find(query)
    .then((user) => {
      if (user) {
        return findUserEvents(user.id, (done, evs, m) => {
          user.setDataValue('events', evs);
          cb(done, user, m);
        });
      }
      cb(true, null, "no users matched");
    })
    .catch(({ message }) => {
      cb(false, null, message);
    })
}

var updateUser = (userid, { username, password, email }, cb, req) => {
  if (!username && !password && !email) {
    return cb(true, null, "no data provided");
  }
  Users.find({ where: { id: userid } }).then(user => {
    if (!user) {
      return cb(false, null, "not found in db");
    }
    if (username) {
      user.setDataValue("username", username);
      req.session.username = username;
    }
    if (email) {
      user.setDataValue("email", email);
    }
    if (password) {
      return bcrypt.hash(password, 10, function(err, hash) {
        user.setDataValue("password", hash);
        user
          .save()
          .then(data => {
            console.log(data);
            utils.findUserEvents(userid, (done, evs) => {
              if (evs && evs.length) {
                user.setDataValue("events", evs);
              }
              cb(true, user, "data updated");
            });
          })
          .catch(({ message }) => {
            cb(false, null, message);
          });
      });
    } else {
      user.save().then(date => {
        utils.findUserEvents(userid, (done, evs) => {
          if (evs && evs.length) {
            user.setDataValue("events", evs);
          }
          cb(true, user, "data updated");
        });
      });
    }
  });
};

var deleteUser = (query, cb)  => {
  Users.find(query)
    .then((user) => {
      if (!user) return cb(false, {message: "not founf in db"});
      user.destroy({})
      cb(true);
    })
    .catch((err) => {
      var m = "error erasing because : " + err.message
      console.log(m);
      cb(false, {message: m});
    })
}

var findUserEvents = (ID, cb) => {
  var all = [];
  OrgsEvents.findAll({where : {user_id : ID }})
  .then((connection) => {
    var counter = connection.length;
    console.log(counter , "connections were found ");
    if (counter) {
      for (var i = 0; i < counter; i++) {
        Events.find({where: {id : connection[i].event_id}})
        .then((ev) => {
          console.log('event : ' , ev.name);
          all.push(ev);
          if (--counter === 0) {
            cb(true, all);
          }
        })
      }
    } else {
      cb(true, [] , "no events found for this user");
    }
  })
  .catch((err) => {
    cb(false, [] , err.message);
  })
}

/************************************************/
/*************                  *****************/
/*************       orgs       *****************/
/*************                  *****************/
/************************************************/

var findOrgWhere = (query , cb) => {
  Orgs.find(query)
    .then((org) => {
      if (org) {
        return findOrgEvents(org.id, (done, evs, m) => {
          if (evs && evs.length) {
            var count = evs.length;
            for (var ev of evs) {
              eventusers(ev.id, (done, users, message) => {
                ev.setDataValue('users', users);
                if (!(--count)) {
                  org.setDataValue('events', evs);
                  cb(done, org, m);
                }
              });
            }
          }
        });
      }
      cb (true, null, "no orgs matched");
    })
    .catch(({message}) => {
      cb (false, null, message);
    })
}

var deleteOrg = (query, cb)  => {
  Orgs.find(query)
    .then((org) => {
      if (!org) return cb(false, {message: "not founf in db"});
      org.destroy({})
      cb(true);
    })
    .catch((err) => {
      var m = "error erasing because : " + err.message
      console.log(m);
      cb(false, {message: m});
    })
}

var updateOrg = function(orgid,  { name, password, email, description, rate}, cb, req) {
  if (!name && !password && !email && !description && !rate) {
    return cb(true, null, "no data provided");
  }
  Orgs.find({ where: { id: orgid } }).then(org => {
    if (!org) {
      return cb(false, null, "not found in db");
    }
    if (name) {
      org.setDataValue("name", name);
      req.session.name = name;
    }
    if (email) {
      org.setDataValue("email", email);
    }
    if (rate) {
      org.setDataValue("rate", rate);
    }
    if (description) {
      org.setDataValue("description", description);
    }
    if (password) {
      return bcrypt.hash(password, 10, function(err, hash) {
        org.setDataValue("password", hash);
        org
          .save()
          .then(data => {
            console.log(data);
            utils.findOrgEvents(orgid, (done, evs) => {
              if (evs && evs.length) {
                org.setDataValue("events", evs);
              }
              cb(true, org, "data updated");
            });
          })
          .catch(({ message }) => {
            console.log("error message :");
            console.log(message);
            cb(false, null, message);
          });
      });
    } else {
      org
        .save()
        .then(date => {
          utils.findOrgEvents(orgid, (done, evs) => {
            if (evs && evs.length) {
              org.setDataValue("events", evs);
            }
            cb(true, org, "data updated");
          });
        })
        .catch(({ message }) => {
          console.log("error message :");
          console.log(message);
          cb(false, null, message);
        });
    }
  });
};

var findOrgEvents = (ID, cb) => {
  Events.findAll({where : {"org_id" : ID}})
    .then((events) => {
      if (!events.length) {
        return cb(true, [] , "no events found");
      }
      cb(true, events);
    })
    .catch(({message}) => {
      cb(false, [] , message);
    })
}

var eventusers = (id, cb) => {
  OrgsEvents.findAll({where : {event_id : id}})
    .then ((connections) => {
      var all = [];
      var counter = connections.length;
      connections.forEach((connecton) => {
        Users.find({where : {id: connecton.user_id}})
          .then ((user) => {
            all.push(user);
            if (!(--counter)) {
              cb (true, all, "done");
            }
          })
      })
    })
}

var updateOrgRate = function (ID, cb) {
  //get all org events ... 
  findOrgEvents(ID, (done, evs, m) => {
    //loop
    var acc = 0;
    for (var i of evs) {
      //sum votes 
      acc += i.rate;
    }
    //calculate average 
    var avg = acc / evs.length;
    //call update org function 
    updateOrg(ID, {rate: avg}, cb);
  });
};

/************************************************/
/*************                  *****************/
/*************     events       *****************/
/*************                  *****************/
/************************************************/


var findEventWhere = (query, cb) => { 
  Events.findAll(query)
    .then((evs) => {
      if (evs && evs.length) {
        cb (true, evs, "found");
      } else {
        cb (true, [], "no events match query");
      }
    })
    .catch(({message}) => {
      cb (false, [], message);
    })
}

var createEvent = (event, cb) => {
  Events.build(event)
    .save()
    .then((ev) => {
      var m = `recieved event : ${event.name} and saved`;
      console.log(m);
      cb(true , m);
    })
    .catch((err) => {
      var m = `error saving event : ${event.name} - sign up coz : ${err.message}`;
      console.log(m);
      cb(false , m);
    })
}

 

var updateEvent = (eventid, {name, description, location, time, duration, rate, volunteers}, cb) => {
  if (!name && !description && !location && !time && !duration && !rate && !volunteers) {
    return cb(true, null, "no data provided");
  }
  Events.find({ where: { id: eventid } }).then( event => {
    if (!event) {
      return cb(false, null, "not found in db");
    }
    if ( name ) {
      event.setDataValue(name);
    }
    if ( description ) {
      event.setDataValue(description);
    }
    if ( location ) {
      event.setDataValue(location);
    }
    if ( time ) {
      event.setDataValue(time);
    }
    if ( duration ) {
      event.setDataValue(duration);
    }
    if ( rate ) {
      event.setDataValue(rate);
    }
    if ( volunteers) {
      event.setDataValue(volunteer);
    }
    event
      .save()
      .then(date => {
        cb(true, event, "data updated");
      })
      .catch(({ message }) => {
        console.log("error message :");
        console.log(message);
        cb(false, null, message);
      });
  });
};

var updateEventRate = (ID, cb) => {
  OrgsEvents.find({where : {event_id : ID}})
    .then ((connections) => {
      var acc = 0;
      for (var con of connections) {
        acc += con.userToEvent;
      }
      var avg = acc / connections.length;
      updateEvent(ID, {rate: avg}, cb);
    })
};

var voteEvent = function ({user_id, userToEvent, event_id}, cb) {
  OrgsEvents.find({where : {user_id : user_id , event_id : event_id}})
    .then ((connection) => {
      var m = "";
      if (!connection) {
        cb(true, null, "join the event to be able to vote it");
      }
      if (connection.userToEvent) {
        m += "your previouse vote was : " + connection.userToEvent;
      }
      connection.setDataValue('userToEvent', userToEvent);
      connection.save()
        .then((data) => {
          m += " your vote signed successfully for the event as : " + userToEvent;
          updateEventRate(event_id, (done, event, m) => {
            if (!done) {
              return cb (done, event, m);
            }
            updateOrgRate(connection.org_id, (done, org, message) => {
              m += message;
              cb(done, org, m);
            });
          });
        })
    })
    .catch(({message}) => {
      m += message;
      cb (false, null, m)
    })
}

var deleteEvent = (event_id, cb) => {
  Events.find({where :{"id" : event_id}})
    .then((event) => {
      if (event === null) {return cb (false , "event doesn't exist")}
      event.destroy({})
        .then((connection) => {
          deleteConnection({"event_id" : event_id}, cb);
        })
    })
    .catch(({message}) => {
      cb(false, message);
    })
}

var deleteConnection = (query, cb) => {
  OrgsEvents.findAll({where : query})
    .then((connection) => {
      if (connection === null) {
        cb(true,"done deleting event and no connections were found");
      } 
      connection.destroy({});
      cb(true, "done deleting event and it's connections");
    })
    .catch(({message}) => {
      cb(false, message);
    })
}


/************************************************/
/*************                  *****************/
/*************     common      *****************/
/*************                  *****************/
/************************************************/

var signout = function (req, res, cb) {
  req.session.destroy(err => {
    if (err) {
      console.log("error destroying session !! , error message : ", err.message);
      cb(false);
    } else {
      cb(true);
    }
  });
}



/************************************************/
/*************                  *****************/
/*************     exports      *****************/
/*************                  *****************/
/************************************************/


//export tables
exports.Events = Events;
exports.OrgsEvents = OrgsEvents;
exports.Users = Users;
exports.Orgs = Orgs;

//export orgs functions
exports.findOrgWhere = findOrgWhere;
exports.deleteOrg = deleteOrg;
exports.findOrgEvents = findOrgEvents;
exports.eventusers = eventusers;
exports.updateOrgRate = updateOrgRate;

//export users functions
exports.findUserWhere = findUserWhere;
exports.deleteUser = deleteUser;
exports.findUserEvents = findUserEvents;

//export events functions
exports.findEventWhere = findEventWhere;
exports.createEvent = createEvent;
exports.deleteEvent = deleteEvent;
exports.deleteConnection = deleteConnection;
exports.updateEvent = updateEvent;

//export common functions
exports.signout = signout;
