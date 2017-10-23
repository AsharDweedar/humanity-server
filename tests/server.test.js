var chai = require('chai');
var request = require('request');
var expect = chai.expect;

var app = require('../server/server');

var server;
var beforEach = (cb) => cb();

describe('' , () => {
  //before each test we will launch the server ..
  before(() => {
    server = app.listen(3337, (err, data) => {
      if (!err) {
        console.log('server is listining');
      } else {
        console.log('server have error : ' , err);
      }
    })
  });
  //close the server after each test ...
  after(() => {
    request('https://thawing-garden-23809.herokuapp.com/users/logout', function(error, res, body) {
      server.close();
    });
    
  });
})

describe('server' , () => {
  //check if the server listens(starts) correctly ...
  it('listens wothout crashing', (done) => {
    request('https://thawing-garden-23809.herokuapp.com/', function(error, res, body) {
      expect(body).to.exist;
    });
    done();
  });
})



describe('users/someEndPoint' , () => {
  describe('/users', () => {
    it('should response with users array if requested /users' , (done) => {
      request('https://thawing-garden-23809.herokuapp.com/users', function(error, res, body) {
        body = JSON.parse(body);
        expect(body).to.exist;
        expect(typeof body).to.equal(typeof []);
        expect(typeof body[0]).to.equal(typeof {});
        expect(typeof body[0].username).to.equal(typeof '');
        expect(typeof body[0].password).to.equal(typeof '');
        expect(typeof body[0].email).to.equal(typeof '');
        expect(typeof body[0].rate).to.equal(typeof 1);
      });
        done();
    })
  })

  describe('/users/signup' , () => {
    it('should response with status 201 if requested /users/signup with valid user info' , (done) => {
      done();
    })
    it('should store user data requested /users/signup with valid user info' , (done) => {
      done();
    })
    it('should response with status 400 if requested /users/signup with invalid user info' , (done) => {
      done();
    })
  })

  describe('users/signin/' , () => {
    it('should response with user\'s info if requested /users/userinfo for a signed-in user' , (done) => {
      done();
    })
    it('should response with status 400 if requested /users/userinfo for a not signed-in user' , (done) => {
      done();
    })
  })
  describe('user/signout', () => {
    xit('should')
    xit('should response with 401 : not authrised if requested /user/info with a not-signed-in user')
  })
})
