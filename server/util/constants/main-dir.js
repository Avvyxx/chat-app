const path = require('node:path');

module.exports = __filename.split(path.sep).slice(0, -4).join(path.sep);
