const bcrypt = require('bcrypt');

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
            cb({"found" : true , "org" : org});
          } else {
            res.status(404); //404 : not found
            cb({"found" : false , "message" : "not found"})
          }
        })
        .catch((err) => {
          res.status(500); //500 : internal server error
          cb({"found" : false , "message" : "server error"});
        })
    },
    '/deleteorg' : (req, res, cb) => {
      var orgName = req.session.username;
      Orgs.find({where : {name : orgName}})
        .then((org) => {
          org.destroy({})
          cb(true);
        })
        .catch((err) => {
          var m = "error erasing because : " + err.message
          console.log(m);
          cb(false, {message: m});
        })
    },
  },
  post : {
    '/signin' : ({body}, res, cb) => {
      console.log(`user to orgs/signin :  ${body}`);
      Orgs.find({where : {name : body.name}})
        .then((dbOrgs) => {
          if (!dbOrgs) {
            res.status(400); //400 : bad request
            return cb({});
          }
          bcrypt.compare(body.password, dbOrgs.password , function (err, match) {
            console.log('signing in for : ', dbOrgs.name);
            if (match) {
              res.status(202);
              cb(dbOrgs);
            } else {
              res.status(400); //400 : bad request
              return cb({});
            }
          })
        })
        .catch((err) => {
          console.log(err.message);
          res.status(500); //500 : internal server error
          cb({});          
        })
    },
    '/signup' : (req, res, cb) => {
      var org = req.body;
      console.log('info of org to signup : ', org.name);
      bcrypt.hash(org.password, 10 , function (err , hash) {
        org.password = hash;
        Orgs.build(org)
          .save()
          .then((data) => {
            var m = `recieved org : ${org.name} and saved`;
            console.log(m);
            cb(true , m);
          })
          .catch((err) => {
            var m = `error saving org : ${org} - sign up coz : ${err.message}`;
            var missing = [];
            if (!org.name) {
              missing.push('name');
            }
            if (!org.email) {
              missing.push('email');
            }
            if (!org.password) {
              missing.push('password');
            }
            console.log(m , 'missing : ' + m);
            cb(false , m, missing);
          })
      })
    },
    '/deleteorg' : ({body : {name}}, res, cb) => {
      Orgs.find({where : {name : name}})
        .then((org) => {
          if (!org) return cb(false, {message: "not founf in db"});
          org.destroy({})
          cb(true);
        })
        .catch((err) => {
          var m = "error erasing because : " + err.message
          console.log(m);
          cb(false, {message: m});
        })
    },
  }
}
