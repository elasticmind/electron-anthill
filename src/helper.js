const request = require('request');

module.exports.post = function(object) {
  return request({
    uri: 'http://localhost:8000/',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    json: object,
  });
};
