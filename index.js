const devcert = require('devcert');
const https = require('https');

process.on('unhandledRejection', (reason) => {
  console.log(reason.stack || reason.message || reason);
});

let skipCertutilInstall = process.argv.find((arg) => arg === '--skip-certutil-install')
let skipHostsFile = process.argv.find((arg) => arg === '--skip-hosts-file')

devcert.certificateFor('my-app.test', { skipCertutilInstall, skipHostsFile }).then((ssl) => {
  https.createServer(ssl, (req, res) => {
    res.write('<h1>Hello world - devcert is working</h1>');
    res.end();
  }).listen(3000);
});