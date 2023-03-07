const fs = require('node:fs');
const path = require('node:path');

const { mainDir } = require('../util');

module.exports = () => {
	fs.writeFileSync(path.join(mainDir, 'server', 'logs', 'session-log.json'), '[]', { encoding: 'utf-8' });
};
