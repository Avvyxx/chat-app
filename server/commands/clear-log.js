const fs = require('node:fs');

const { mainDir } = require('../util');

module.exports = () => {
	fs.writeFileSync(`${mainDir}/server/logs/session-log.json`, '[]', { encoding: 'utf-8' });
};
