var app = require('../server');
var expect = require('chai').expect;
var superagent = require('superagent');
var fs = require('fs');

describe('server', function() {
  var server;

  // before the test, create a server using server.js
  beforeEach(function() {
    server = app().listen(8081);
  });

  afterEach(function() {
    server.close();
  });

  it('prints out the index.html page when user goes to /', function(done) {
    superagent.get('http://localhost:8081/', function(error, res) {
      var html = fs.readFileSync(process.cwd() + '/public/index.html');
      html = html.toString();
      expect(error).to.be.null;
      expect(res.status).to.equal(200);
      expect(res.text).to.equal(html);
      done();
    });
  });


  it('prints out {"unix":1450137600,"natural":"December 15, 2015"} when user goes to /December%2015,%202015', function(done) {
    superagent.get('http://localhost:8081/December%2015,%202015', function(error, res) {
      expect(error).to.be.null;
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("{\"unix\":1450137600,\"natural\":\"December 15, 2015\"}");
      done();
    });
  });

  it('prints out {"unix":1450137600,"natural":"December 15, 2015"} when user goes to /December 15, 2015', function(done) {
    superagent.get('http://localhost:8081/December 15, 2015', function(error, res) {
      expect(error).to.be.null;
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("{\"unix\":1450137600,\"natural\":\"December 15, 2015\"}");
      done();
    });
  });

  it('prints out {"unix":1450137600,"natural":"December 15, 2015"} when user goes to /1450137600', function(done) {
    superagent.get('http://localhost:8081/1450137600', function(error, res) {
      expect(error).to.be.null;
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("{\"unix\":1450137600,\"natural\":\"December 15, 2015\"}");
      done();
    });
  });

  it('prints out {"unix":-5,"natural":"December 31, 1969"} when user goes to /-5', function(done) {
    superagent.get('http://localhost:8081/-5', function(error, res) {
      expect(error).to.be.null;
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("{\"unix\":-5,\"natural\":\"December 31, 1969\"}");
      done();
    });
  });

  it('prints out {"unix":-500000000,"natural":"February 26, 1954"} when user goes to /-500000000', function(done) {
    superagent.get('http://localhost:8081/-500000000', function(error, res) {
      expect(error).to.be.null;
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("{\"unix\":-500000000,\"natural\":\"February 26, 1954\"}");
      done();
    });
  });

  it('prints out {"unix":null,"natural":"null"} when user goes to /December 15', function(done) {
    superagent.get('http://localhost:8081/December 15', function(error, res) {
      expect(error).to.be.null;
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("{\"unix\":null,\"natural\":null}");
      done();
    });
  });

  it('prints out {"unix":null,"natural":null} when user goes to /notadate', function(done) {
    superagent.get('http://localhost:8081/notadate', function(error, res) {
      expect(error).to.be.null;
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("{\"unix\":null,\"natural\":null}");
      done();
    });
  });
});
