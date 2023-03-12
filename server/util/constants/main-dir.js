const path = require('node:path');

module.exports = __dirname.split(path.sep).slice(0, -3).join(path.sep);
