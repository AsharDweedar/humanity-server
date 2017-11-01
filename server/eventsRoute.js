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
    'bytime' : (req, res, cb) => {
      
    },
    'bylocation' : (req, res, cb) => {
      
    }
  },
}
