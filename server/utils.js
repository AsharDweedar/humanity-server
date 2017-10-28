const Events = require('../database/comp/events.js');
const OrgsEvents = require('../database/comp/orgsevents.js');
const Users = require('../database/comp/users.js');
const Orgs = require('../database/comp/orgs.js');

exports.findOrgWhere = (query , cb) => {
  Orgs.find(query)
    .then((org) => {
      cb (true, org);
    })
    .catch(({message}) => {
      cb (false, [], message);
    })
}

exports.deleteOrg = (query, cb)  => {
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

exports.findOrgEvents = (ID, cb) => {
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


exports.createEvent = (event, cb) => {
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


exports.deleteEvent = ( event_id, cb) => {
  Events.find({where :{"id" : event_id}})
    .then((event) => {
      event.destroy({})
        .then((connection) => {
          this.deleteConnection({"id" : event_id}, cb);
        })
    })
    .catch(({message}) => {
      cb(false, message);
    })
}

exports.deleteConnection = (query, cb) => {
  OrgsEvents.find({where : query})
    .then((connection) => {
      connection.destroy({});
      cb(true);
    })
    .catch(({message}) => {
      cb(false, message);
    })
}