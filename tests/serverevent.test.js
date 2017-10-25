var chai = require('chai');
var request = require('request');
var expect = chai.expect;

// var uri = 'https://thawing-garden-23809.herokuapp.com/';
var uri = 'http://localhost:3336/';

var someevent;
var requestWithSession = request.defaults({jar: true});

describe('server' , () => {
  describe('events end point' , () => {
    describe('/events/', () => {
      
      it('should response with events array if requested /events' , (done) => {
        request(`${uri}events`, function(error, res, body) {
          body = JSON.parse(body);
          someevent = body[0]
          it('should response with status 302 if requested /events' , function (doneGetevents) {
            var code = res.statusCode;
            expect(code).to.equal(302);
            doneGetevents();
          });
          expect(error).to.not.exist;
          expect(body).to.exist;
          expect(body , 'get/events', 'get/events- events are array').to.be.a('array');
          expect(someevent, 'get/events-event is object').to.be.a('object');
          expect(someevent, 'get/events-have eventname').to.have.property('name')
          expect(someevent.eventname, 'get/events-eventname is string').to.be.a('string');
          done();
        });
      });
    })
    var event = {"username":"eventcreator","password":"1234","email":"toCreate@events.thesis"};
    describe('/events/signup' , () => {
      var opts = {
        "uri" : `${uri}events/signup`,
        "method" : "POST",
        "json" : event
      }
      it('should response with status 201 if requested /events/signup with valid event info' , (doneOfSignupStatus) => {
        request(opts, (err, res, body) => {
          expect(res.statusCode).to.equal(201);
          doneOfSignupStatus();
        })// request signup  ***********************
      })//end it  signup status .........doneOfDeleteStatus...............
      it('should store event data requested /events/signup with valid event info' , (doneOfStoreevent) => {
        request(`${uri}events`, function(error, res, body) {
          body = JSON.parse(body);
          var dbevent = body.reduce((acc, ele) => {
            if (event.eventname === ele.eventname) {
              acc = ele;
            }
            return acc;
          }, undefined);
          expect(dbevent).to.exist;
          expect(dbevent.eventname).to.equal(event.eventname)
          expect(dbevent.password).to.equal(event.password)
          expect(dbevent.email).to.equal(event.email);
          doneOfStoreevent();
        }) //end of get events "request" ***********************
      }) //end it should store data .........doneOfStoreevent..........
      it('should response with status 400 if requested /events/signup with two simmilar eventnames' , (doneFailingSignUp) => {
        request(opts, (err, res, body) => {
          expect(res.statusCode).to.equal(400);
          expect(body.saved).to.equal(false);
          doneFailingSignUp();
        })// request signup  ***********************
      }) // end it
    }) //end of decribe signup 

    describe('/events/deleteevent', () => {
      it ('should delete the event at request /deleteevent', (doneOfDelete) => {
        request({
          "uri" : `${uri}events/deleteevent`,
          "method" : "POST",
          "json" : {"eventname" : event.eventname}
        }, (error, response, resbody) => {
          //we delete the event to make sure our request will work no matter the times we call it ... 
          expect(response.statusCode).to.equal(202); 
          doneOfDelete();
        }) //end of request deleteevent callback  ***********************
      }) //end of "it" delete event ..........doneOfDelete................
    })

    describe('events/signin', () => {
      it('should not sign-in a event with in-correct password' , (done) => {
        request({
          "uri":`${uri}events/signin`,
          "method": "POST",
          "json":{"eventname" : someevent.eventname, "password" : "not correct password"}
        }, function (err, res, body) {
          expect(body).to.not.have.property("eventname");
          done();
        })
      }) // end it
      it('should sign-in a event with valid eventname and password' , (doneSignIn) => {
        requestWithSession({
          "uri":`${uri}events/signin`,
          "method": "POST",
          "json":{"eventname" : someevent.eventname, "password" : someevent.password}
        }, function (err, res, body) {
          expect(body).to.have.property("eventname");
          expect(body.eventname).to.equal(someevent.eventname);
          doneSignIn();

          describe('events/eventinfo/' , () => {
            it('should response with event\'s info if requested /events/eventinfo for a signed-in event' , (done) => {
              requestWithSession(`${uri}events/eventinfo`, function (err, res, body) {
                body = JSON.parse(body);
                if (!body.event) {
                  console.log(body);
                  return done();
                }
                expect(body.event).to.have.property("eventname");
                expect(body.event.eventname).to.equal(someevent.eventname);
                done();
              })
            }) // end it
          })//describe useinfo
          describe('event/signout', () => {
            it('should sign event out', function (signedout) {
              requestWithSession(`${uri}events/signout`,function (err, res, body) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(202);
                signedout();
              })
            })
          }) // describe event/signout

          it('should response with status 400 if requested /events/eventinfo for a not signed-in event' , (done) => {
            request(`${uri}events/signout`,function (err, res, body) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(400);
                done();
              })
            done();
          }) // end it
        }) // end request with session
      }) // end it sign in correct password
    }) // describe events/signin/ 
  }) //describe events end point
}) //describe server ....
