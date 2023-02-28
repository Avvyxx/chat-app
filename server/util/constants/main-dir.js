const os = require('node:os');

const system = os.platform();

const whichSlash = system === 'win32' ? '\\' : system === 'linux' ? '/' : null;

module.exports = __dirname.split(whichSlash).slice(0, -2).join(whichSlash);
