var should = require('chai').should(),
  request = require('supertest'),
  mockgoose = require('mockgoose'),
  mongoose = require('mongoose');

mockgoose(mongoose);
var app = require('../web').app,
  Lesson = require('../lib/models/lesson'),
  Fortune = require('../lib/models/fortune');

describe("cookie", function() {
  before(function() {
    mockgoose.reset();

    Lesson.create({
      _id: "53ffcf1d4ea4f76d1b8f223e",
      chinese: "因特网",
      pronunciation: "yintewang",
      english: "internet"
    }, {
      _id: "53ffcf1d4ea4f76d1b8f223f",
      chinese: "狮子狗",
      pronunciation: "shizi gou",
      english: "poodle"
    }, {
      _id: "53ffcf1d4ea4f76d1b8f2240",
      chinese: "早安。",
      pronunciation: "zǎo ān.",
      english: "Good morning. "
    });

    Fortune.create({
      _id: '53ffcf1d4ea4f76d1b8f223e',
      message: 'Fortune 1'
    }, {
      _id: '53ffcf1d4ea4f76d1b8f223f',
      message: 'Fortune 2'
    }, {
      _id: '53ffcf1d4ea4f76d1b8f2240',
      message: 'Fortune 3'
    });
  });

  it("returns a random cookie", function(done) {
    request(app)
      .get("/v1/cookie")
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(1);
        res.body[0].should.ownProperty('lesson');
        res.body[0].should.ownProperty('fortune');
        res.body[0].should.ownProperty('lotto');
        done();
      });
  });

  it("returns a cookie with specified fortune", function(done) {
    request(app)
      .get("/v1/cookie?fortuneId=53ffcf1d4ea4f76d1b8f223f")
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(1);
        res.body[0].fortune.should.deep.equal({
          id: "53ffcf1d4ea4f76d1b8f223f",
          message: "Fortune 2"
        });
        done();
      });
  });

  it("returns a cookie with specified lesson", function(done) {
    request(app)
      .get("/v1/cookie?lessonId=53ffcf1d4ea4f76d1b8f223f")
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(1);
        res.body[0].lesson.should.deep.equal({
          id: "53ffcf1d4ea4f76d1b8f223f",
          pronunciation: "shizi gou",
          chinese: "狮子狗",
          english: "poodle"
        });
        done();
      });
  });

  it("returns a cookie with specified lotto", function(done) {
    request(app)
      .get("/v1/cookie?lottoId=002200130056000900370023")
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(1);
        res.body[0].lotto.should.deep.equal({
          id: '002200130056000900370023',
          numbers: [22, 13, 56, 9, 37, 23]
        });
        done();
      });
  });

  it("returns a cookie with specified attributes", function(done) {
    request(app)
      .get(
        "/v1/cookie?fortuneId=53ffcf1d4ea4f76d1b8f223f&lessonId=53ffcf1d4ea4f76d1b8f223f&lottoId=002200130056000900370023"
    )
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(1);
        res.body[0].should.deep.equal({
          fortune: {
            id: "53ffcf1d4ea4f76d1b8f223f",
            message: "Fortune 2"
          },
          lesson: {
            id: "53ffcf1d4ea4f76d1b8f223f",
            pronunciation: "shizi gou",
            chinese: "狮子狗",
            english: "poodle"
          },
          lotto: {
            id: '002200130056000900370023',
            numbers: [22, 13, 56, 9, 37, 23]
          }
        });
        done();
      });
  });

  it("returns limit cookies", function(done) {
    request(app)
      .get("/v1/cookie?limit=3")
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(3);
        for (var i = 0; i < 3; ++i) {
          res.body[i].should.ownProperty('lesson');
          res.body[i].should.ownProperty('fortune');
          res.body[i].should.ownProperty('lotto');
        }
        done();
      });
  });

  it("returns limit cookies with specified fortune", function(done) {
    request(app)
      .get(
        "/v1/cookie?limit=3&fortuneId=53ffcf1d4ea4f76d1b8f223f"
    )
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(3);
        for (var i = 0; i < 3; ++i) {
          res.body[i].fortune.should.deep.equal({
            id: "53ffcf1d4ea4f76d1b8f223f",
            message: "Fortune 2"
          });
          res.body[i].should.ownProperty('lesson');
          res.body[i].should.ownProperty('lotto');
        }
        done();
      });
  });

  it("returns limit cookies with specified lesson", function(done) {
    request(app)
      .get(
        "/v1/cookie?limit=3&lessonId=53ffcf1d4ea4f76d1b8f223f"
    )
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(3);
        for (var i = 0; i < 3; ++i) {
          res.body[i].lesson.should.deep.equal({
            id: "53ffcf1d4ea4f76d1b8f223f",
            pronunciation: "shizi gou",
            chinese: "狮子狗",
            english: "poodle"
          });
          res.body[i].should.ownProperty('fortune');
          res.body[i].should.ownProperty('lotto');
        }
        done();
      });
  });

  it("returns limit cookies with specified lotto", function(done) {
    request(app)
      .get(
        "/v1/cookie?limit=3&lottoId=002200130056000900370023"
    )
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(3);
        for (var i = 0; i < 3; ++i) {
          res.body[i].lotto.should.deep.equal({
            id: '002200130056000900370023',
            numbers: [22, 13, 56, 9, 37, 23]
          });
          res.body[i].should.ownProperty('fortune');
          res.body[i].should.ownProperty('lesson');
        }
        done();
      });
  });

  it("returns limit cookies with specified objects", function(done) {
    request(app)
      .get(
        "/v1/cookie?limit=3&fortuneId=53ffcf1d4ea4f76d1b8f223f&lessonId=53ffcf1d4ea4f76d1b8f223f&lottoId=002200130056000900370023"
    )
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.have.length(3);
        for (var i = 0; i < 3; ++i) {
          res.body[i].should.deep.equal({
            fortune: {
              id: "53ffcf1d4ea4f76d1b8f223f",
              message: "Fortune 2"
            },
            lesson: {
              id: "53ffcf1d4ea4f76d1b8f223f",
              pronunciation: "shizi gou",
              chinese: "狮子狗",
              english: "poodle"
            },
            lotto: {
              id: '002200130056000900370023',
              numbers: [22, 13, 56, 9, 37, 23]
            }
          });
        }
        done();
      });
  });
});