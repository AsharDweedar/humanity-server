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
          expect(someevent, 'get/events-have name').to.have.property('name')
          expect(someevent.name, 'get/events-name is string').to.be.a('string');
          done();
        });
      });
    })

    var user = {"username":"Ashar","password":"1234"};
    var org = {"name":"ashar","password":"1234"};
    var event = {"name":"some event"};
    

    describe('events/create', () => {
      it('should not create an event with not-signed-in org' , (done) => {
        request({
          "uri":`${uri}events/create`,
          "method": "POST",
          "json":{"name" : event.name, "password" : "not correct password"}
        }, function (err, res, body) {
          expect(body).to.not.have.property("name");
          done();
        })
      }) // end it
      xit('should create an event with signed-in org' , (donecreate) => {
        requestWithSession({
          "uri":`${uri}events/create`,
          "method": "POST",
          "json": event
        }, function (err, res, body) {
          expect(body).to.have.property("name");
          expect(body.name).to.equal(event.name);
          donecreate();          
        }) // end request with session
      }) // end it sign in correct password
    }) // describe events/create/ 





    describe('/events/myevents' , () => {
      var optsSignin = {
        "uri" : `${uri}users/signin`,
        "method" : "POST",
        "json" : org
      }
      it('should response with status 400 if requested /events/myevents with not-signed-in user' , (done) => {
        request(`${uri}events/myevents`, (err, res, body) => {
          expect(res.statusCode).to.equal(400);
          done();
        })// request events/myevents  ***********************
      })//end it  events/myevents status 
      xit('should get all events if requested /events/myevents with signed-in user' , (doneOfStoreevent) => {
        request(`${uri}events`, function(error, res, body) {
          body = JSON.parse(body);
          var dbevent = body.reduce((acc, ele) => {
            if (event.name === ele.name) {
              acc = ele;
            }
            return acc;
          }, undefined);
          expect(dbevent).to.exist;
          expect(dbevent.name).to.equal(event.name)
          expect(dbevent.password).to.equal(event.password)
          expect(dbevent.email).to.equal(event.email);
          doneOfStoreevent();
        }) //end of get events "request" ***********************
      }) //end it should store data ...
    }) //end of decribe signup 


    xdescribe('/events/delevent', () => {
      xit ('should delete the event at request events/delevent', (doneOfDelete) => {
        request({
          "uri" : `${uri}events/delevent`,
          "method" : "POST",
          "json" : {"event_id" : event.name}
        }, (error, response, resbody) => {
          //we delete the event to make sure our request will work no matter the times we call it ... 
          expect(response.statusCode).to.equal(202); 
          doneOfDelete();
        }) //end of request delevent callback  ***********************
      }) //end of "it" delete event ..........doneOfDelete................
    })
  }) //describe events end point
}) //describe server ....
