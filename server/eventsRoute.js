//utils
const utils =  require('./utils.js');

//tables
const Events = utils.Events;
const OrgsEvents = utils.OrgsEvents;
const Users = utils.Users; //not used 
const Orgs = utils.Orgs;//not used

module.exports = {
  get : {
      '/' : (req, res, cb) => {
        Events.findAll()
          .then((events) => {
            cb(true, events);
          })
          .catch((err) => {
            console.log('error getting Events : ' , err);
            cb(false, []);
          })
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
      console.log('info of event to create : ', event);
      utils.createEvent(event, cb);
    },
    '/delteevent' : (req, res, cb) => {
      org_id = req.session.orgid;
      event_id = req.body.id;
      utils.deleteEvent(org_id, event_id, cb);
    },
    '/join' : (req, res, cb) => {
      var event = req.body;
      var user_id = req.session.userid;
      var ev = {"event_id": event.id , "user_id": user_id, "org_id" : event.org_id};
      OrgsEvents.find({where : ev})
        .then((data) => {
          if (!!data) {
            res.status(400); //400 : bad request
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
    }
  },
}
