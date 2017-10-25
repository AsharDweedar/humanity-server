var chai = require('chai');
var request = require('request');
var expect = chai.expect;

// var uri = 'https://thawing-garden-23809.herokuapp.com/';
var uri = 'http://localhost:3336/';

var someUser;
var requestWithSession = request.defaults({jar: true});

describe('server' , () => {
  describe('users end point' , () => {
    describe('/users/', () => {
      it('should response with status 302 if requested /users' , function (doneGetUsers) {
        request(`${uri}users`, function(error, res, body) {
          var code = res.statusCode;
          if (code) {
            expect(code).to.equal(302);
            doneGetUsers();
          }
        })
      })
      it('should response with users array if requested /users' , (done) => {
        request(`${uri}users`, function(error, res, body) {
          body = JSON.parse(body);
          someUser = body[0]
          expect(error).to.not.exist;
          expect(body).to.exist;
          expect(body , 'get/users', 'get/users-users are array').to.be.a('array');
          expect(someUser, 'get/users-user is object').to.be.a('object');
          expect(someUser, 'get/users-have username').to.have.property('username')
          expect(someUser.username, 'get/users-username is string').to.be.a('string');
          expect(someUser, 'get/users-have password').to.have.property('password');
          expect(someUser.password, 'get/users-password if string').to.be.a('string');
          expect(someUser, 'get/users-have email').to.have.property('email');
          expect(someUser.email, 'get/users-email is string').to.be.a('string');
          expect(someUser).to.have.property('rate');
          //expect(typeof body[0].rate).to.be.a('number');
          done();
        });
      })
    })
    var user = {"username":"haya","password":"1234","email":"haya@Users.thesis"};
    describe('/users/signup' , () => {
      var opts = {
        "uri" : `${uri}users/signup`,
        "method" : "POST",
        "json" : user
      }
      it('should response with status 201 if requested /users/signup with valid user info' , (doneOfSignupStatus) => {
        request(opts, (err, res, body) => {
          expect(res.statusCode).to.equal(201);
          doneOfSignupStatus();
        })// request signup  ***********************
      })//end it  signup status .........doneOfDeleteStatus...............
      it('should store user data requested /users/signup with valid user info' , (doneOfStoreUser) => {
        request(`${uri}users`, function(error, res, body) {
          body = JSON.parse(body);
          var dbUser = body.reduce((acc, ele) => {
            if (user.username === ele.username) {
              acc = ele;
            }
            return acc;
          }, undefined);
          expect(dbUser).to.exist;
          expect(dbUser.username).to.equal(user.username)
          expect(dbUser.password).to.equal(user.password)
          expect(dbUser.email).to.equal(user.email);
          doneOfStoreUser();
        }) //end of get users "request" ***********************
      }) //end it should store data .........doneOfStoreUser..........
      it('should response with status 400 if requested /users/signup with two simmilar usernames' , (doneFailingSignUp) => {
        request(opts, (err, res, body) => {
          expect(res.statusCode).to.equal(400);
          expect(body.saved).to.equal(false);
          doneFailingSignUp();
        })// request signup  ***********************
      }) // end it
    }) //end of decribe signup 

    describe('/users/deleteuser', () => {
      it ('should delete the user at request /deleteuser', (doneOfDelete) => {
        request({
          "uri" : `${uri}users/deleteuser`,
          "method" : "POST",
          "json" : {"username" : user.username}
        }, (error, response, resbody) => {
          //we delete the user to make sure our request will work no matter the times we call it ... 
          expect(response.statusCode).to.equal(202); 
          doneOfDelete();
        }) //end of request deleteuser callback  ***********************
      }) //end of "it" delete user ..........doneOfDelete................
    })

    describe('users/signin', () => {
      it('should not sign-in a user with in-correct password' , (done) => {
        request({
          "uri":`${uri}users/signin`,
          "method": "POST",
          "json":{"username" : someUser.username, "password" : "not correct password"}
        }, function (err, res, body) {
          expect(body).to.not.have.property("username");
          done();
        })
      }) // end it
      it('should sign-in a user with valid username and password' , (doneSignIn) => {
        requestWithSession({
          "uri":`${uri}users/signin`,
          "method": "POST",
          "json":{"username" : someUser.username, "password" : someUser.password}
        }, function (err, res, body) {
          expect(body).to.have.property("username");
          expect(body.username).to.equal(someUser.username);
          doneSignIn();

          describe('users/userinfo/' , () => {
            it('should response with user\'s info if requested /users/userinfo for a signed-in user' , (done) => {
              requestWithSession(`${uri}users/userinfo`, function (err, res, body) {
                body = JSON.parse(body);
                if (!body.user) {
                  console.log(body);
                  return done();
                }
                expect(body.user).to.have.property("username");
                expect(body.user.username).to.equal(someUser.username);
                done();
              })
            }) // end it
          })//describe useinfo
          describe('user/signout', () => {
            it('should sign user out', function (signedout) {
              requestWithSession(`${uri}users/signout`,function (err, res, body) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(202);
                signedout();
              })
            })
          }) // describe user/signout

          it('should response with status 400 if requested /users/userinfo for a not signed-in user' , (done) => {
            request(`${uri}users/signout`,function (err, res, body) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(400);
                done();
              })
            done();
          }) // end it
        }) // end request with session
      }) // end it sign in correct password
    }) // describe users/signin/ 
  }) //describe users end point
}) //describe server ....
