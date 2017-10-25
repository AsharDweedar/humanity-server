var chai = require('chai');
var request = require('request');
var expect = chai.expect;

// var uri = 'https://thawing-garden-23809.herokuapp.com/';
var uri = 'http://localhost:3336/';

var someorg;
var requestWithSession = request.defaults({jar: true});

describe('server' , () => {
  describe('orgs end point' , () => {
    describe('/orgs/', () => {
      it('should response with status 302 if requested /orgs' , function (doneGetorgs) {
        request(`${uri}orgs`, function(error, res, body) {
          var code = res.statusCode;
          if (code) {
            expect(code).to.equal(302);
            doneGetorgs();
          }
        })
      })
      it('should response with orgs array if requested /orgs' , (done) => {
        request(`${uri}orgs`, function(error, res, body) {
          body = JSON.parse(body);
          someorg = body[0]
          expect(error).to.not.exist;
          expect(body).to.exist;
          expect(body , 'get/orgs', 'get/orgs-orgs are array').to.be.a('array');
          expect(someorg, 'get/orgs-org is object').to.be.a('object');
          expect(someorg, 'get/orgs-have name').to.have.property('name')
          expect(someorg.name, 'get/orgs-name is string').to.be.a('string');
          expect(someorg, 'get/orgs-have password').to.have.property('password');
          expect(someorg.password, 'get/orgs-password if string').to.be.a('string');
          expect(someorg, 'get/orgs-have email').to.have.property('email');
          expect(someorg.email, 'get/orgs-email is string').to.be.a('string');
          expect(someorg).to.have.property('rate');
          //expect(typeof body[0].rate).to.be.a('number');
          done();
        });
      })
    })
    var org = {"name":"haya","password":"1234","email":"haya@orgs.thesis"};
    describe('/orgs/signup' , () => {
      var opts = {
        "uri" : `${uri}orgs/signup`,
        "method" : "POST",
        "json" : org
      }
      it('should response with status 201 if requested /orgs/signup with valid org info' , (doneOfSignupStatus) => {
        request(opts, (err, res, body) => {
          expect(res.statusCode).to.equal(201);
          doneOfSignupStatus();
        })// request signup  ***********************
      })//end it  signup status .........doneOfDeleteStatus...............
      it('should store org data requested /orgs/signup with valid org info' , (doneOfStoreorg) => {
        request(`${uri}orgs`, function(error, res, body) {
          body = JSON.parse(body);
          var dborg = body.reduce((acc, ele) => {
            if (org.name === ele.name) {
              acc = ele;
            }
            return acc;
          }, undefined);
          expect(dborg).to.exist;
          expect(dborg.name).to.equal(org.name)
          expect(dborg.password).to.equal(org.password)
          expect(dborg.email).to.equal(org.email);
          doneOfStoreorg();
        }) //end of get orgs "request" ***********************
      }) //end it should store data .........doneOfStoreorg..........
      it('should response with status 400 if requested /orgs/signup with two simmilar names' , (doneFailingSignUp) => {
        request(opts, (err, res, body) => {
          expect(res.statusCode).to.equal(400);
          expect(body.saved).to.equal(false);
          doneFailingSignUp();
        })// request signup  ***********************
      }) // end it
    }) //end of decribe signup 

    describe('/orgs/deleteorg', () => {
      it ('should delete the org at request /deleteorg', (doneOfDelete) => {
        request({
          "uri" : `${uri}orgs/deleteorg`,
          "method" : "POST",
          "json" : {"name" : org.name}
        }, (error, response, resbody) => {
          //we delete the org to make sure our request will work no matter the times we call it ... 
          if (!error) {
            expect(response.statusCode).to.equal(202); 
          }
          doneOfDelete();
        }) //end of request deleteorg callback  ***********************
      }) //end of "it" delete org ..........doneOfDelete................
    })

    describe('orgs/signin', () => {
      it('should not sign-in a org with in-correct password' , (done) => {
        request({
          "uri":`${uri}orgs/signin`,
          "method": "POST",
          "json":{"name" : someorg.name, "password" : "not correct password"}
        }, function (err, res, body) {
          expect(body).to.not.have.property("name");
          done();
        })
      }) // end it
      it('should sign-in a org with valid name and password' , (doneSignIn) => {
        requestWithSession({
          "uri":`${uri}orgs/signin`,
          "method": "POST",
          "json":{"name" : someorg.name, "password" : someorg.password}
        }, function (err, res, body) {
          expect(body).to.have.property("name");
          expect(body.name).to.equal(someorg.name);
          doneSignIn();

          describe('orgs/orginfo/' , () => {
            it('should response with org\'s info if requested /orgs/orginfo for a signed-in org' , (done) => {
              requestWithSession(`${uri}orgs/orginfo`, function (err, res, body) {
                body = JSON.parse(body);
                expect(body.org).to.have.property("name");
                expect(body.org.name).to.equal(someorg.name);
                done();
              })
            }) // end it
          })//describe useinfo
          describe('org/signout', () => {
            it('should sign org out', function (signedout) {
              requestWithSession(`${uri}orgs/signout`,function (err, res, body) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(202);
                signedout();
              })
            })
          }) // describe org/signout

          it('should response with status 400 if requested /orgs/orginfo for a not signed-in org' , (done) => {
            request(`${uri}orgs/signout`,function (err, res, body) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(400);
                done();
              })
            done();
          }) // end it
        }) // end request with session
      }) // end it sign in correct password
    }) // describe orgs/signin/ 
  }) //describe orgs end point
}) //describe server ....
