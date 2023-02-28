const fs = require('node:fs');

const mainDir = require('../util/constants/main-dir');

module.exports = () => {
	fs.writeFileSync(`${mainDir}/server/logs/session-log.json`, '[]', { encoding: 'utf-8' });
};
