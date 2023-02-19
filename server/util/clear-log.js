const fs = require('node:fs');

const mainDir = require('./main-dir');

module.exports = () => {
	fs.writeFileSync(`${mainDir}\\server\\message-log.json`, '[]', { encoding: 'utf-8' });
};
