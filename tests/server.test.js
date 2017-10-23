var chai = require('chai');
var request = require('request');
var expect = chai.expect;

//var sequelize = require('../database/main.js');

// var beforEach = (cb) => cb();

// describe('' , () => {
//   //before each test we will launch the server ..
//   before(() => {
//     server = app.listen(3337, (err, data) => {
//       if (!err) {
//         console.log('server is listining');
//       } else {
//         console.log('server have error : ' , err);
//       }
//     })
//   });
//   //close the session after each test ...
//   after(() => {
//     request('http://localhost:3337/users/logout', function(error, res, body) {
//       sequelize.close();
//       server.close();
//     });
    
//   });
// })

//examples : 
// expect(foo).to.be.a('string');
// expect(foo).to.equal('bar');
// expect(foo).to.have.lengthOf(3);
// expect(beverages).to.have.property('tea').with.lengthOf(3);
// expect(answer, 'topic [answer]').to.equal(42);

describe('server' , () => {
  //check if the server listens(starts) correctly ...
  it('listens wothout crashing', (done) => {
    request('https://thawing-garden-23809.herokuapp.com/', function(error, res, body) {
      expect(body).to.exist;
      done();
    });
  });
  describe('users/someEndPoint' , () => {
    describe('/users', () => {
      it('should response with status 302 if requested /users' , (done) => {
        request('https://thawing-garden-23809.herokuapp.com/users', function(error, res, body) {
          expect(res.statusCode).to.equal(302);
          done();
        })
      })
      it('should response with users array if requested /users' , (done) => {
        request('https://thawing-garden-23809.herokuapp.com/users', function(error, res, body) {
          body = JSON.parse(body);
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

    describe('/users/signup' , () => {
      var user = {
            "username":"Haya",
            "password":"1234",
            "email":"ashar@Users.thesis"
          };
      var opts = {
        "uri" : "https://thawing-garden-23809.herokuapp.com/users/signup",
        "methode" : "POST",
        "json" : user
      }
      request({
        "uri" : "https://thawing-garden-23809.herokuapp.com/users/deleteuser",
        "methode" : "POST",
        "json" : {"username" : "Haya"}
      }, (err, res, body) => {
        //we delete the user to make sure our request will work no matter the times we call it ... 
        //all "it" down here are inside the callback of the deleteuser request 
        it('should response with status 201 if requested /users/signup with valid user info' , (done) => {
          request(opts, (err, res, body) => {
            expect(res.statusCode).to.equal(201);
            done();
          })
        })
        it('should store user data requested /users/signup with valid user info' , (done) => {
          request('https://thawing-garden-23809.herokuapp.com/users', function(error, res, body) {
            body = JSON.parse(body);
            console.log(body)
            var dbUser = body.reduce((acc, ele) => {
              console.log(user.username ,ele.username)
              if (user.username === ele.username) {
                console.log(acc, ele);
                acc = ele;
              }
              return acc;
            }, undefined);
            expect(dbUser.username).to.equal("Haya")
            expect(dbUser.password).to.equal("1234")
            expect(dbUser.email).to.equal("ashar@Users.thesis");
            done();
          });
        })
        xit('should response with status 400 if requested /users/signup with invalid user info' , (done) => {
          done();
        });
        xit('shouldn\'t allow two simmilar usernames', (done) => {
          done();
        })
      }) //end of request deleteuser callback 
    }) //end of decribe signup

    describe('users/signin/' , () => {
      xit('should response with user\'s info if requested /users/userinfo for a signed-in user' , (done) => {
        done();
      })
      xit('should response with status 400 if requested /users/userinfo for a not signed-in user' , (done) => {
        done();
      })
    })

    describe('user/signout', () => {
      xit('should')
      xit('should response with 401 : not authrised if requested /user/info with a not-signed-in user')
    })
  })
})
