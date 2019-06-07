const fs = require('fs');

const machine = process.env.DOCKER_HOST;
const tls = process.env.DOCKER_TLS_VERIFY;
const certDir = process.env.DOCKER_CERT_PATH;

if (!machine)
  throw new Error('You must set the DOCKER_HOST is require');


if (tls === 1)
  throw new Error('When using DOCKER_TLS_VERIFY=1 you must specify the property DOCKER_CERT_PATH for certificates');


if (!certDir)
  throw new Error('You must set the DOCKER_CERT_PATH environment variable');


module.exports = {
  protocol: 'https',
  host: machine.substr(machine.indexOf(':', 0) + 3, machine.indexOf(':', 6) - 6),
  port: parseInt(machine.substr(-4), 10),
  checkServerIdentity: false,
  ca: fs.readFileSync(certDir + '/ca.pem'),
  cert: fs.readFileSync(certDir + '/cert.pem'),
  key: fs.readFileSync(certDir + '/key.pem'),
  version: 'v1.25'
}
