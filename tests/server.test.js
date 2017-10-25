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
}) //describe server ....
