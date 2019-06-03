const request = require('request');

module.exports.post = function(object) {
  return request({
    uri: 'http://localhost:8000/',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    json: object,
  }, (error) => {
    if (error) {
      console.log('An error happened during posting the request', error);
      process.exit(0);
    }
  });
};
