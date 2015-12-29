var request = require('supertest');
var app = require('../app');

describe('GET /', function () {
  it('should return 200', function() {
    request(app)
      .get('/')
      .expect('200')
  });
});

describe('GET /artists', function () {
  it('should return 200', function() {
    request(app)
      .get('/artists')
      .expect('200')
  });
});

describe('GET /artists/mogatanpe', function () {
  it('should return 200', function() {
    request(app)
      .get('/artists/mogatanpe')
      .expect('200')
  });
});
