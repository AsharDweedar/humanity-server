//utils
const utils =  require('./utils.js');

module.exports = {
  '/deleteEvent' : ({body : {event_id}}, res, cb) => {
    utils.deleteEvent( event_id, cb);
  },
  '/createEvent' : (req, res, cb) => {
    var event = req.body;
    console.log('info of event to create : ', event);
    utils.createEvent(event, cb);
  }
}
