const os = require('node:os');

const system = os.platform();

module.exports = system === 'win32' ? __dirname.split('\\').slice(0, -2).join('\\') : system === 'linux' ? __dirname.split('/').slice(0, -2).join('/') : null;
