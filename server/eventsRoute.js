const Events = require('../database/comp/events.js');
const OrgsEvents = require('../database/comp/eventsRel.js');
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
        query[selector] = req.session.id;
        OrgsEvents.find(query)
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
    // '/join' : (req, res, cb) => {
    //   var username = req.session.username;
    //   var event = req.dody;
    //   Users.find({where : {"username" : username}})
    //     .then(({id}) => {
    //       OrgsEvents.build({event_id: event.id ,user_id:  ,org_id: event})
    //     })
    // }
  }
}

/*

User.findOne()
data.destroy({}) 
data.updateAttributes({key : val})


.................................
User.findOne().then(user => {
  console.log(user.get('firstName'));
}); 
or
user = await User.findOne()
console.log(user.get('firstName'));
 ................................
.................................


Item.find({where:{name:'Laptop'}}).complete(function (err, data) {
  if(err){
    console.log(err);
  }
  if(data){
      data.destroy({}) or 
    data.updateAttributes({
        name:'Computer'
      }).success(function (data1) {
        console.log(data1);
      })
 }
});

*/