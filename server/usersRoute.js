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
            cb(user);
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
      console.log('info to users/signin :  ', info);
      Users.find({where : {username : info.username , password : info.password}})
        .then((user) => {
          if (user.username) {
            console.log('signing in for : ', user.get('name'));
            res.status(202);
            return cb(true);
          }
          res.status(400); //400 : bad request
          cb(false);
        })
        .catch((err , user) => {
          res.status(500); //500 : internal server error
          cb(false);          
        })
    },
    '/signup' : (req, res, cb) => {
      var user = req.body;
      console.log('info of user to signup : ', user);
      Users.build(user)
        .save()
        .then((data) => {
          var m = "recieved user : " + user.username + " and saved !!";
          console.log(m);
          cb(true , m);
        })
        .catch((err) => {
          var m = "recieved user : " + user + " but not saved coz : " + err.message;
          console.log(m);
          cb(false , m);
        })
    }
  }
}