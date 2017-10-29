const bcrypt = require('bcrypt');

//utils
const utils = require('./utils.js');
const Orgs = utils.Orgs;

module.exports = {
  get : {
    '/' : (req, res, cb) => {
      Orgs.findAll()
        .then((org) => {
          cb (true, org);
        })
        .catch(({message}) => {
          cb (false, [], message);
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
      utils.findOrgWhere({ where : {name : orgName}}, cb);
    },
    '/deleteorg' : (req, res, cb) => {
      var orgName = req.session.name;
      utils.deleteOrg({where: {name: orgName}}, cb);
    },
  },
  post : {
    '/signin' : ({body}, res, toServer) => {
      console.log(`user to orgs/signin :  ${body}`);
      Orgs.find({where : {name : body.name}})
        .then((dbOrg) => {
          if (!dbOrg || !dbOrg.name) {
            res.status(400); //400 : bad request
            return toServer({});
          }
          bcrypt.compare(body.password, dbOrg.password , function (err, match) {
            console.log('signing in for : ', dbOrg.name);
            if (match) {
              res.status(202);
              utils.findOrgEvents(dbOrg.id, (done, evs, m) => {
                console.log('events found  : ', evs);
                console.log('error messages : ' , m );
                dbOrg.setDataValue ('events', evs);
                toServer(dbOrg);
              })
            } else {
              res.status(400); //400 : bad request
              return toServer({});
            }
          })
        })
        .catch((err) => {
          console.log(err.message);
          res.status(500); //500 : internal server error
          toServer({});          
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
      utils.deleteOrg({where: {name: name}}, cb);
    },
    '/orgbyid' : ({body}, res, cb) => {
      Orgs.find({where : {id : body.org_id}})
        .then((org) => {
          res.status(!!org ? 302 : 404); //302 : found , 404 : not found
          if (!org) return cb(false, "not founf in db");
          console.log('found org' + org.name);
          cb(true , org);
        })
        .catch((err) => {
          res.status(500); //500 :server err
          var m = "error finding because : " + err.message;
          console.log(m);
          cb(false, m);
        })
    }
  }
}
