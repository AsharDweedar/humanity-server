const bcrypt = require('bcrypt');

//utils 
const utils = require('./utils.js');
const Orgs = utils.Orgs;

module.exports = {
  get : {
    '/' : (req, res, cb) => {
      Orgs.findAll()
        .then((org) => {
          if (org) {return cb(true, org, "found")}
          cb(true, [], "no orgs matched");
        })
        .catch(({ message }) => {
          console.log(message);
          cb(false, [], message);
        })
    },
    '/signout' : (req, res, cb) => {
      utils.signout(req, res, cb);
    },
    '/orginfo' : (req, res, cb) => {
      var orgName = req.session.name;
      utils.findOrgWhere({ where : {name : orgName}}, cb);
    },
  },
  post : {
    '/signin' : ({body}, res, toServer) => {
      console.log(`user to orgs/signin :  ${body.name}`);
      Orgs.find({ where: { name: body.name } })
        .then(dbOrg => {
          if (!dbOrg || !dbOrg.name) {
            res.status(400); //400 : bad request
            return toServer({ message: "incorrect name" });
          }
          bcrypt.compare(body.password, dbOrg.password, function(
            err,
            match
          ) {
            console.log("signing in for : ", dbOrg.name);
            if (match) {
              res.status(202);
              utils.findOrgEvents(dbOrg.id, (done, evs, m) => {
                console.log("events found  : ", evs.length);
                console.log("error messages : ", m);
                dbOrg.setDataValue("events", evs);
                toServer(dbOrg);
              });
            } else {
              res.status(400); //400 : bad request
              return toServer({ message: "incorrect password" });
            }
          });
        })
        .catch(({ message }) => {
          console.log(message);
          res.status(500); //500 : internal server error
          toServer({ message: message });
        });
    },
    '/signup' : (req, res, cb) => {
      var org = req.body;
      console.log('info of org to signup : ', org.name);
      bcrypt.hash(org.password, 10 , function (err, hash) {
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
    '/orgbyid' : ({body: {org_id}}, res, cb) => {
      utils.findOrgWhere({ where: { id: org_id } }, cb);
    },
    '/eventusers' : ({body : {id}}, res, cb) => {
      utils.eventusers(id, cb);
    },
  },
  put : {
    "/editprofile" : (req, res, cb) => {
      utils.updateOrg(req.session.orgid, req.body, cb, req);
    }
  },
  '/delete' : {
    '/deletemyaccount' : (req, res, cb) => {
      var orgName = req.session.name;
      utils.deleteOrg({where: {name: orgName}}, cb);
    },
  }
}
