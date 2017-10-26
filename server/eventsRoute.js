const Events = require('../database/comp/events.js');
const OrgsEvents = require('../database/comp/orgsevents.js');
const Users = require('../database/comp/users.js');
const Orgs = require('../database/comp/orgs.js');


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
      '/myevents' : (req, res, cb) => {
        var query = {}
        var selector = req.session.type === 'user' ? "user_id" : "org_id"
        query[selector] = selector === "user_id" ? req.session.userid : req.session.orgid;
        OrgsEvents.find({where : query})
          .then((events) => {
            cb(true, events);
          })
          .catch((err) => {
            cb(false, []);
          })
      }
  },
  post : {
    '/create' : (req, res, cb) => {
      var event = req.body;
      event.org_id = req.session.username;
      console.log('info of event to create : ', event);
      Events.build(event)
        .save()
        .then((ev) => {
          var m = `recieved event : ${event} and saved`;
          console.log(m);
          cb(true , m);
        })
        .catch((err) => {
          var m = `error saving event : ${event} - sign up coz : ${err.message}`;
          console.log(m);
          //edit the events table to accept name of org instead of id ..
          cb(false , m);
        })
    },
    '/delteevent' : (req, res, cb) => {
      org_id = req.session.orgid;
      event_id = req.body.id;
      OrgsEvents.find({where :{ "org_id" : org_id , "event_id" : event_id}})
        .then((data) => {
          data.destroy({});
          Events.find({where :{ "org_id" : org_id , "id" : event_id}})
            .then((data) => {
              data.destroy({});
              cb(true);
            })
        })
        .catch(({message}) => {
          cb(false, message);
        })
    },
    '/join' : (req, res, cb) => {
      var event = req.body;
      var user_id = req.session.userid;
      var ev = {"event_id": event.id , "user_id": user_id , "org_id": event.org_id};
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
    }
  }
}
