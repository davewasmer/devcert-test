const yargs = require('yargs');
const devcert = require('devcert');
const https = require('https');

process.on('unhandledRejection', (reason) => {
  if (reason) {
    console.log(reason.stack || reason.message || reason);
    process.exit(1)
  } else {
    console.log('Unhandled promise rejection with no reason');
  }
});

args = yargs
  .command('$0 [domain]', 'run the server', (yargs) => {
    yargs.positional('domain', {
      default: 'my-app.test',
      type: 'string'
    });
  })
  .option('skip-certutil-install', { type: 'boolean' })
  .option('skip-hosts-file', { type: 'boolean' })
  .argv;

devcert.certificateFor(args.domain, {
  skipCertutilInstall: args.skipCertutilInstall,
  skipHostsFile: args.skipHostsFile,
  ui: {
    firefoxWizardPromptPage(certificateURL) {
      return `
        <html>
          <body>
            <h1>Let's install a certificate</h1>
            <a href="${ certificateURL }">Click here</a>
          </body>
        </html>
      `;
    }
  }
}).then((ssl) => {
  https.createServer(ssl, (req, res) => {
    res.write('<h1>Hello world - devcert is working</h1>');
    res.end();
  }).listen(3000, () => console.log('Ready to test'));
}).catch((e) => {
  console.error('devcert failed:');
  console.error(e);
  console.error(e.stack);
});