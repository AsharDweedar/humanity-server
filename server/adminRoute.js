//utils
const utils =  require('./utils.js');

module.exports = {
  '/deleteEvent' : ({body : {event_id}}, res, cb) => {
    utils.deleteEvent( event_id, cb);
  },
  '/createEvent' : ({body}, res, cb) => {
    utils.createEvent(body, cb);
  },
  '/deleteorg': ({ body: { ID } }, res, cb) => {
    utils.deleteOrg({ where: { id: ID } }, cb);
  },
  '/deleteuser': ({ body : { ID } }, res, cb) => {
    utils.deleteUser({ where: { id: ID } }, cb);
  },
  '/connections' : (req, res) => {
    utils.OrgsEvents.findAll()
      .then((all) => {
        res.send(all);
        // var count = all.length * 2 ;
        // all.forEach((ele) => {
        //   ele.user_id
        // })
      });
  }
}
