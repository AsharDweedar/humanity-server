//utils
const utils =  require('./utils.js');
const Events = utils.Events;
const OrgsEvents = utils.OrgsEvents;
const Users = utils.Users;
const Orgs = utils.Orgs;

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
        var query = {}
        OrgsEvents.find({where : query})
          .then((connection) => {
            var counter = connection.length;
            if (counter) {
              for (var i = 0; i < counter; i++) {
                Events.find({where: {id : connnection.event_id}})
                .then((ev) => {
                  connection[i] = ev;
                  if (!--counter) {
                    cb(true, connection);
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
  },
  post : {
    '/create' : (req, res, cb) => {
      var event = req.body;
      event.org_id = req.session.id;
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
  },
  admin : {
    '/deleteEvent' : ({body : {org_id  , event_id}}, res, cb) => {
      utils.deleteEvent(org_id, event_id, cb);
    },
    '/createEvent' : (req, res, cb) => {
      var event = req.body;
      console.log('info of event to create : ', event);
      utils.createEvent(event, cb);
    }
  }
}
