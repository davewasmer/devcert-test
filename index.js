const devcert = require('devcert');
const https = require('https');

devcert.certificateFor('my-app.test').then((ssl) => {
  https.createServer(ssl, (req, res) => {
    res.write('<h1>Hello world - devcert is working</h1>');
    res.end();
  }).listen(3000);
});