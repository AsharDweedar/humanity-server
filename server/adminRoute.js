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
      })
      .catch(({message}) => {
        console.log(message);
        res.send(message);
      })
  },
  '/connectionswhere' : (req, res) => {
    utils.OrgsEvents.findAll(req.body)
      .then((all) => {
        res.send(all);
      })
      .catch(({message}) => {
        console.log(message);
        res.send(message);
      })
  },
  '/deleteconnectionswhere' : (req, res) => {
    utils.OrgsEvents.findAll(req.body)
      .then((all) => {
        for (var ev of all) {
          ev.destroy();
        }
        res.send("deleteing");
      })
      .catch(({message}) => {
        console.log(message);
        res.send(message);
      })
  },
}
