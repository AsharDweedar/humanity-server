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
    utils.deleteOrg({ where: { ID: ID } }, cb);
  },
  '/deleteuser': ({ body : { ID } }, res, cb) => {
    utils.deleteUser({ where: { ID: ID } }, cb);
  },
}
