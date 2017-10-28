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
      cb (true, user);
    })
    .catch(({message}) => {
      cb (false, [], message);
    })
}

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
  // OrgsEvents.find({where : {"user_id" : ID}})
  //   .then((events) => {
  //     if (!events.length) {
  //       return cb(true, [] , "no events found");
  //     }
  //     cb(true, events);
  //   })
  //   .catch((err) => {
  //     cb(false, []);
  //   })
}

/************************************************/
/*************                  *****************/
/*************       orgs       *****************/
/*************                  *****************/
/************************************************/

var findOrgWhere = (query , cb) => {
  Orgs.find(query)
    .then((org) => {
      cb (true, org);
    })
    .catch(({message}) => {
      cb (false, [], message);
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

var findOrgEvents = (ID, cb) => {
  Events.find({where : {"org_id" : ID}})
    .then((events) => {
      if (!events.length) {
        return cb(true, [] , "no events found");
      }
      cb(true, events);
    })
    .catch((err) => {
      cb(false, []);
    })
}


/************************************************/
/*************                  *****************/
/*************     events       *****************/
/*************                  *****************/
/************************************************/


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
      //edit the events table to accept name of org instead of id ..
      cb(false , m);
    })
}


var deleteEvent = ( event_id, cb) => {
  Events.find({where :{"id" : event_id}})
    .then((event) => {
      event.destroy({})
        .then((connection) => {
          deleteConnection({"id" : event_id}, cb);
        })
    })
    .catch(({message}) => {
      cb(false, message);
    })
}

var deleteConnection = (query, cb) => {
  OrgsEvents.find({where : query})
    .then((connection) => {
      connection.destroy({});
      cb(true);
    })
    .catch(({message}) => {
      cb(false, message);
    })
}

exports.Events = Events ;
exports.OrgsEvents = OrgsEvents ;
exports.Users = Users ;
exports.Orgs = Orgs ;

exports.findOrgWhere = findOrgWhere;
exports.deleteOrg = deleteOrg;
exports.findOrgEvents = findOrgEvents;

exports.createEvent = createEvent;
exports.deleteEvent = deleteEvent;
exports.deleteConnection = deleteConnection;

exports.findUserWhere = findUserWhere;
exports.deleteUser = deleteUser;
exports.findUserEvents = findUserEvents;
