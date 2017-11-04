//utils
const utils = require("./utils.js");

//tables
const Events = utils.Events;
const OrgsEvents = utils.OrgsEvents;
const Users = utils.Users; //not used 
const Orgs = utils.Orgs;//not used

module.exports = {
  get : {
    '/' : (req, res, cb) => {
      utils.findEventWhere({}, cb);
    },
    '/orgevents' : (req, res, cb) => {
      utils.findOrgEvents(req.session.orgid , cb);
    },
    '/userevents' : (req, res, cb) => {
      utils.findUserEvents(req.session.userid , cb);
    }
  },
  post : {
    '/create' : (req, res, cb) => {
      var event = req.body;
      event.org_id = req.session.orgid;
      utils.createEvent(event, cb);
    },
    '/join' : ({body : {id , org_id}, session : {userid}}, res, cb) => {
      if (!org_id || !id) {
        res.status(400); //400 : bad request
        return cb(false, "missing info : org_id = " + org_id + "event.id" + id);
      }
      var ev = { "event_id": id, "user_id": userid, "org_id" : org_id};
      OrgsEvents.find({where : ev})
        .then((data) => {
          if (!!data) {
            res.status(304); //400 : bad request
            return cb(false, "already joined");
          }
          OrgsEvents.build(ev)
            .save()
            .then(() => {
              res.status(201);//201 : accepted
              cb(true, "you are joined now !!");
            })
        })
        .catch(({message}) => {
          res.status(500); //500 : server error
            cb(false, message);
          })
    },
    '/vote' : ({body : {id, vote}, session : {userid}}, res, cb) => {
      utils.voteEvent({user_id: userid, event_id : id, userToEvent : vote} , cb);
    },
    '/bytime' : ({body: {after , before}}, res, cb) => {
      if (after) {
        var timeA = after.split(' ');
        timeFormate = timeA[0] + "T" + timeA[1] + ":00.000Z";
      }
      if (before) {
        var timeB = before.split(' ');
        timeFormate = timeB[0] + "T" + timeB[1] + ":00.000Z";
      }
      var query = {where : {}};
      if (after && before) {
        query.where = {
          time : {
            $lt : before,
            $gt : after
          }
        }
      } else if (after) {
        query.where = {
          time: {
            $gt: after
          }
        }
      } else {
        query.where = {
          time: {
            $lt: before
          }
        }
      }
      utils.findEventWhere(query, cb);
    },
    '/bylocation' : ({body : {location}}, res, cb) => {
      var query = { where: { location: location}};
      utils.findEventWhere(query, cb);
    },
    '/eventusers' : ({body : {id}}, res, cb) => {
      utils.eventusers(id, cb);
    },
  },
  put : {
    '/updateevent' : ({body}, res, cb) => {
      utils.updateEvent(body, cb);
    }
  },
  delete : {
    '/unjoin' : ({body : {id , org_id}, session : {userid}}, res, cb) => {
      if (!org_id || !id) {
        res.status(400); //400 : bad request
        return cb(false, "missing info : org_id = " + org_id + "event.id" + id);
      }
      var ev = { "event_id": id, "user_id": userid, "org_id" : org_id};
      OrgsEvents.find({where : ev})
        .then((data) => {
          if (!data) {
            res.status(400); //400 : bad request
            return cb(false, "you are not joined");
          }
          data.destroy()
            .then(() => {
              res.status(201);//201 : accepted
              cb(true, "your contibution is now cancled !!");
            })
        })
        .catch(({message}) => {
          res.status(500); //500 : server error
            cb(false, message);
          })
    },
    '/delteevent' : (req, res, cb) => {
      org_id = req.session.orgid;
      event_id = req.body.id;
      utils.deleteEvent(event_id, cb);
    },
  }
}
