
//import db tables ....
const Events = require('../database/comp/events.js');
const OrgsEvents = require('../database/comp/orgsevents.js');
const Users = require('../database/comp/users.js');
const Orgs = require('../database/comp/orgs.js');

//bcrypt
const bcrypt = require("bcrypt");

/************************************************/
/*************                  *****************/
/*************     users        *****************/
/*************                  *****************/
/************************************************/


function findUserWhere (query , cb) {
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

function updateUser (userid, { username, password, email }, cb, req) {
  if (!username && !password && !email) {
    return cb(true, null, "no data provided");
  }
  Users.find({ where: { id: userid } }).then(user => {
    if (!user) {
      return cb(false, null, "not found in db");
    }
    if (username) {
      user.setDataValue("username", username);
      if (req) req.session.username = username;
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
            findUserEvents(userid, (done, evs) => {
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
        findUserEvents(userid, (done, evs) => {
          if (evs && evs.length) {
            user.setDataValue("events", evs);
          }
          cb(true, user, "data updated");
        });
      });
    }
  });
};

function updateUserRate (user_id, cb) {
  OrgsEvents.find()
    .then ((connections) => {
      var acc = 0;
      for (var i of connections) {
        acc += i.orgToUser;
      }
      var avg = acc / evs.length;
      updateUser(ID, { rate: avg }, cb);
    })
    .catch(({message}) => {

    })
};

function voteUser ({ user_id, orgToUser, org_id }, cb) {
  OrgsEvents.find({ where: { user_id: user_id, org_id: org_id } })
    .then(connection => {
      var m = "";
      if (!connection) {
        cb(true, null, "you can't vote a user who didn't join your event");
      }
      if (connection.orgToUser) {
        m += "your previouse vote was : " + connection.orgToUser;
      }
      connection.setDataValue("orgToUser", orgToUser);
      connection
        .save()
        .then(data => {
          m += " your vote signed successfully for the event as : " + orgToUser;
          updateUserRate(user_id, (done, user, message) => {
              m += message;
              cb(done, user, m);
          });
        });
    })
    .catch(({ message }) => {
      m += message;
      cb(false, null, m);
    });
};

function deleteUser (query, cb)  {
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

function findUserEvents (ID, cb)  {
  var all = [];
  OrgsEvents.findAll({where : {user_id : ID }})
  .then((connection) => {
    var counter = connection.length;
    console.log(counter , "connections were found ");
    if (counter) {
      for (var i = 0; i < counter; i++) {
        Events.find({where: {id : connection[i].event_id}})
        .then((ev) => {
          if (ev) {
            console.log('event : ' , ev.name);
            all.push(ev);
          }
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

function findOrgWhere (query , cb) {
  Orgs.find(query)
    .then((org) => {
      if (org) {
        findOrgEvents(org.id, (done, evs, m) => {
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
          } else {
            cb(true, org, "found data");
          }
        });
      } else {
        cb (true, null, "no orgs matched");
      }
    })
    .catch(({message}) => {
      cb (false, null, message);
    })
}

function deleteOrg (query, cb)  {
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

function updateOrg (orgid,  { name, password, email, description, rate}, cb, req) {
  Orgs.find({ where: { id: orgid } }).then( org => {
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
            findOrgEvents(orgid, (done, evs) => {
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
        .then( data => {
          findOrgEvents(orgid, (done, evs) => {
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

function findOrgEvents (ID, cb) {
  Events.findAll({where : {"org_id" : ID}})
    .then((evs) => {
      if (evs && evs.length) {
        var count = evs.length;
        for (var ev of evs) {
          eventusers(ev.id, (done, users, message) => {
            ev.setDataValue("users", users);
            if (!--count) {
              cb(done, evs, "done");
            }
          });
        }
      } else {
        cb(true, [], "no events found");
      }
      // cb(true, events);
    })
    .catch(({message}) => {
      cb(false, [] , message);
    })
}

function updateOrgRate (ID, cb) {
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

function findEventWhere (query, cb) { 
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

function createEvent (event, cb) {
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
};
 
function updateEvent(eventid, { name, description, location, time, duration, rate, volunteers, ageLimit, joined }, cb) {
  Events.find({ where: { id: eventid } }).then(event => {
    if (!event) {
      return cb(false, null, "not found in db");
    }
    if (name) {
      event.setDataValue(name);
    }
    if (description) {
      event.setDataValue(description);
    }
    if (location) {
      event.setDataValue(location);
    }
    if (time) {
      event.setDataValue(time);
    }
    if (duration) {
      event.setDataValue(duration);
    }
    if (rate) {
      event.setDataValue(rate);
    }
    if (volunteers) {
      event.setDataValue(volunteers);
    }
    if (ageLimit) {
      event.setDataValue(ageLimit);
    }
    if (joined) {
      event.setDataValue(joined);
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

function updateEventRate (ID, cb) {
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

function voteEvent ({user_id, userToEvent, event_id}, cb) {
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

function eventusers(id, cb) {
  OrgsEvents.findAll({ where: { event_id: id } }).then(connections => {
    var all = [];
    var counter = connections.length;
    if (counter) {
      connections.forEach(connecton => {
        Users.find({ where: { id: connecton.user_id } }).then(user => {
          all.push(user);
          if (!--counter) {
            cb(true, all, "done");
          }
        });
      });
    } else {
      cb(true, [], "done");
    }

  });
}

function deleteEvent (event_id, cb) {
  Events.find({where :{"id" : event_id}})
    .then((event) => {
      if (event === null) {return cb (true , "no connections to delete ")}
      event.destroy({})
        .then((someThing) => {
          deleteConnection({"event_id" : event_id}, (done, m) => {
             cb(done , event + m);
          });
        })
    })
    .catch(({message}) => {
      cb(false, message);
    })
}

function deleteConnection (query, cb) {
  OrgsEvents.findAll({where : query})
    .then((connections) => {
      if (connections === null || !connections) {
        return cb(true," ,no connections were found to delete");
      } 
      var count = connections.length;
      for (var conn of connections) {
        conn.destroy({})
        .then((data) => {
          if (!(--count)) {
            cb(true, "done deleting event and it's connections");
          }
        })
        .catch(({message}) => {
          console.log(message);
        })
      }
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

//export users functions
exports.findUserWhere = findUserWhere;
exports.updateUser = updateUser;
exports.updateUserRate = updateUserRate;
exports.voteUser = voteUser;
exports.deleteUser = deleteUser;
exports.findUserEvents = findUserEvents;

//export orgs functions
exports.findOrgWhere = findOrgWhere;
exports.deleteOrg = deleteOrg;
exports.updateOrg = updateOrg;
exports.findOrgEvents = findOrgEvents;
exports.updateOrgRate = updateOrgRate;

//export events functions
exports.findEventWhere = findEventWhere;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.updateEventRate = updateEventRate;
exports.voteEvent = voteEvent;
exports.eventusers = eventusers;
exports.deleteEvent = deleteEvent;
exports.deleteConnection = deleteConnection;

//export common functions
exports.signout = signout;
