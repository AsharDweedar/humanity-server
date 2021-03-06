const bcrypt = require('bcrypt');

//utils
const utils = require('./utils.js');
const Users = utils.Users;

module.exports = {
  get : {
    '/' : (req, res, cb) => {
      Users.findAll()
        .then((user) => {
          if (user) { return cb(true, user, "found") }
          cb(true, [], "no users matched");
        })
        .catch(({ message }) => {
          cb(false, [], message);
        })
    },
    '/signout' : (req, res, cb) => {
      utils.signout(req, res, cb);
    },
    '/userinfo' : (req, res, cb) => {
      var userName = req.session.username;
      utils.findUserWhere({ where: { username: userName } }, cb);
    },
  },
  post : {
    '/signin' : ({body}, res, toServer) => {
      console.log(`user to users/signin :  ${body.username}`);
      Users.find({where : {username : body.username}})
        .then((dbUser) => {
          if (!dbUser || !dbUser.username) {
            res.status(400); //400 : bad request
            return toServer({"message" : "incorrect username"});
          }
          bcrypt.compare(body.password, dbUser.password , function (err, match) {
            console.log('signing in for : ', dbUser.username , match);
            if (match) {
              res.status(202);
              utils.findUserEvents(dbUser.id, (done, evs, m) => {
                console.log('events found  : ', evs.length);
                console.log('messages : ' , m );
                dbUser.setDataValue ('events', evs);
                toServer(dbUser);
              })
            } else {
              res.status(400); //400 : bad request
              return toServer({"message" : "incorrect password"});
            }
          })
        })
        .catch((err) => {
          console.log('error sign in user : ', err.message);
          res.status(500); //500 : internal server error
          toServer({"message" : "server error"});          
        })
    },
    '/signup' : (req, res, cb) => {
      var user = req.body;
      console.log('info of user to signup : ', user.username);
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
            var m = `error saving user : ${user.username} - sign up coz : ${err.message} , `;
            if (err.original && err.original.message) {
              console.log(err.original.message);
              m += err.original.message;
            }
            if (err.errors && err.errors.length) {
              for (var er of err.errors) {
                m += er.message;
              }
            }
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
            if (err.errors) err.errors.forEach((e) => (m += e.message))
            console.log(m);
            missing && console.log('missing : ' , missing);
            cb(false , m, missing);
          })
      })
    },
    '/userbyid' : ({body}, res, cb) => {
      utils.findUserWhere({ where: { id: body.user_id } }, cb);
    },
    '/voteuser' : ( {body : {user_id , vote }, session : {orgid}}, res, cb) => {
      utils.voteUser({ "user_id" : user_id, "orgToUser" : vote, "org_id" : orgid }, cb);
    }
  },
  put : {
    "/editprofile" : (req, res, cb) => {
      var {body, session : {userid}} = req;
      utils.updateUser(userid, body, cb, req);
    }
  },
  delete : {
    '/deletemyaccount' : (req, res, cb) => {
      var userName = req.session.username;
      utils.deleteUser({ where: { username: userName } })
    },
  }
}