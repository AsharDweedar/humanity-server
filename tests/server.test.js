var chai = require('chai');
var request = require('request');
var expect = chai.expect;

// var uri = 'https://thawing-garden-23809.herokuapp.com/';
var uri = 'http://localhost:3336/';

//examples : 
// expect(foo).to.be.a('string');
// expect(foo).to.equal('bar');
// expect(foo).to.have.lengthOf(3);
// expect(beverages).to.have.property('tea').with.lengthOf(3);
// expect(answer, 'topic [answer]').to.equal(42);

describe('server' , () => {
  //check if the server listens(starts) correctly ...
  it('listens wothout crashing', (done) => {
    request(`${uri}`, function(error, res, body) {
      expect(body).to.exist;
      done();
    });
  });
  describe('users end point' , () => {
    describe('/users/', () => {
      it('should response with status 302 if requested /users' , function (doneGetUsers) {
        request(`${uri}users`, function(error, res, body) {
          var code = res.statusCode;
          console.log('status code for /users : ', code);
          expect(code).to.equal(302);
          doneGetUsers();
        })
      })
      it('should response with users array if requested /users' , (done) => {
        request(`${uri}users`, function(error, res, body) {
          body = JSON.parse(body);
          console.log(`recieved ${body.length} users`);
          expect(error).to.not.exist;
          expect(body).to.exist;
          expect(body , 'get/users', 'get/users').to.be.a('array');
          expect(body[0], 'get/users').to.be.a('object');
          expect(body[0], 'get/users').to.have.property('username')
          expect(body[0].username, 'get/users').to.be.a('string');
          expect(body[0], 'get/users').to.have.property('password');
          expect(body[0].password, 'get/users').to.be.a('string');
          expect(body[0], 'get/users').to.have.property('email');
          expect(body[0].email, 'get/users').to.be.a('string');
          expect(body[0]).to.have.property('rate');
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
          if (err) {
            console.log(err.message , ' status : ' ,res.statusCode);
          } else {
            console.log(body);
            //body = JSON.parse(body);
            console.log('no errors , saved : ' , body.saved)
          }
          expect(res.statusCode).to.equal(201);
          doneOfSignupStatus();
        })// request signup  ***********************
      })//end it  signup status .........doneOfDeleteStatus...............
      it('should store user data requested /users/signup with valid user info' , (doneOfStoreUser) => {
        request(`${uri}users`, function(error, res, body) {
          body = JSON.parse(body);
          if (error) {
            console.log('error signup : ' , error.message);
          } else {
            //console.log(body);
          }
          var dbUser = body.reduce((acc, ele) => {
            console.log(user.username ,ele.username)
            if (user.username === ele.username) {
              acc = ele;
            }
            return acc;
          }, undefined);
          expect(dbUser).to.exist;
          expect(dbUser.username).to.equal(user.username)
          expect(dbUser.password).to.equal(user.password)
          expect(dbUser.email).to.equal(user.email);
         
          console.log('done of them all ..................')
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
          console.log('error : ', error);
          if (!error) {
            expect(response.statusCode).to.equal(202); 
          }
          doneOfDelete();
        }) //end of request deleteuser callback  ***********************
      }) //end of "it" delete user ..........doneOfDelete................
    })

    describe('users/signin/' , () => {
      it('should response with user\'s info if requested /users/userinfo for a signed-in user' , (done) => {
        done();
      }) // end it
      it('should response with status 400 if requested /users/userinfo for a not signed-in user' , (done) => {
        done();
      }) // end it
    }) // describe users/signin/

    describe('user/signout', () => {
      it('should')
      it('should response with 401 : not authrised if requested /user/info with a not-signed-in user')
    }) // describe user/signout
  }) //describe users end point
}) //describe server ....
