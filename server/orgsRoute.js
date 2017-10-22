const Orgs = require('../database/comp/orgs.js');

module.exports = {
  get : {
    '/' : (req, res, cb) => {
      Orgs.findAll()
        .then((orgs) => {
          console.log('found : ' , orgs.length , ' orgs ...');
          cb(true, orgs);
        })
        .catch((err) => {
          console.log('error getting Orgs : ' , err);
          cb(false, []);
        })
    },
    '/signout' : (req, res, cb) => {
      req.session.destroy((err) => {
        if (err) {
          console.log('error destroying session !! , error message : ' , err.message);
          cb(false);
        } else {
          cb(true);
        }
      })
    },
    '/orginfo' : (req, res, cb) => {
      var orgName = req.session.username;
      Orgs.find({ where : {name : orgName}})
        .then((org) => {
          if (org){
            res.status(302); //302 : found
            cb(org);
          } else {
            res.status(404); //404 : not found
            cb({})
          }
        })
        .catch((err) => {
          res.status(500); //500 : internal server error
          cb({});
        })
    },
  },
  post : {
    '/signin' : (req, res, cb) => {
      var info = req.body;
      console.log('info to orgs/signin :  ', info);
      Orgs.find({where : {name : info.name , password : info.password}})
        .then((org) => {
          if (org.name) {
            console.log('signing in for : ', org.get('name'));
            res.status(202);
            return cb(true)
          }
          res.status(400); //400 : bad request
          cb(false);
        })
        .catch((err) => {
          res.status(500); //500 : internal server error
          cb(false);          
        })
    },
    '/signup' : (req, res, cb) => {
      var info = req.body;
      console.log('info of org to signup : ', info);
      Orgs.build(info)
        .save()
        .then((data) => {
          var m = `recieved org : ${info.name} and saved`;
          console.log(m);
          cb(true , m);
        })
        .catch((err) => {
          var m = `error saving org : ${info} - sign up coz : ${err.message}`;
          console.log(m);
          cb(false , m);
        })
    }
  }
}
