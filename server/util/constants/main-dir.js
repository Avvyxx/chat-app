const path = require('node:path');

module.exports = path.join(...__dirname.split(path.sep).slice(0, 4));
