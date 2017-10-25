const bcrypt = require('bcrypt');

const Users = require('../database/comp/users.js');

module.exports = {
  get : {
    '/' : (req, res, cb) => {
      Users.findAll()
        .then((users) => {
          console.log('found : ' , users.length , ' users ...');
          cb(true, users);
        })
        .catch((err) => {
          console.log('error getting users : ' , err);
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
    '/userinfo' : (req, res, cb) => {
      var userName = req.session.username;
      Users.find({where : {username : userName}})
        .then((user) => {
          if (user){
            res.status(302); //302 : found
            cb({"found" : true , "user" : user});
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
    '/deleteuser' : (req, res, cb) => {
      var userName = req.session.username;
      Users.find({where : {username : userName}})
        .then((user) => {
          user.destroy({})
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
      console.log(`user to users/signin :  ${body}`);
      Users.find({where : {username : body.username}})
        .then((dbUser) => {
          if (!dbUser.username) {
            res.status(400); //400 : bad request
            return cb({});
          }
          bcrypt.compare(body.password, dbUser.password , function (err, match) {
            console.log('signing in for : ', dbUser.username);
            if (match) {
              res.status(202);
              cb(dbUser);
            } else {
              res.status(400); //400 : bad request
              return cb({});
            }
          })
        })
        .catch((err) => {
          res.status(500); //500 : internal server error
          cb({});          
        })
    },
    '/signup' : (req, res, cb) => {
      var user = req.body;
      console.log('info of user to signup : ', user);
      bcrypt.hash(user.password, 10 , function (err , hash) {
        user.password = hash;
        Users.build(user)
          .save()
          .then((data) => {
            var m = "recieved user : " + user.username + " and saved !!";
            console.log(m);
            cb(true , m);
          })
          .catch((err) => {
            console.log(err)
            var m = "recieved user : " + user.username + " but not saved coz : " ;
            var missing = [];
            if (!user.username) {
              missing.push('name');
            }
            if (!user.email) {
              missing.push('email');
            }
            if (!user.password) {
              missing.push('password');
            }
            console.log('...............................................');
            if (err.errors) err.errors.forEach((e) => (m += e.message))
            console.log(m);
            missing && console.log('missing : ' , missing);
            console.log('...............................................');
            cb(false , m, missing);
          })
      })
    },
    '/deleteuser' : (req, res, cb) => {
      var userName = req.body.username;
      Users.find({where : {username : userName}})
        .then((user) => {
          if (!!user) {
            user.destroy({})
            cb(true);
          } else {
            var m = "error erasing because user not found :("
            console.log(m);
            cb(false, {message: m});
          }
        })
        .catch((err) => {
          var m = "error erasing because : " + err.message
          console.log(m);
          cb(false, {message: m});
        })
    },
  }
}