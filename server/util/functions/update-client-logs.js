const fs = require('node:fs');

const toDataFrame = require('./to-data-frame');
const mainDir = require('../constants/main-dir');

module.exports = (socket) => {
	const curLog = fs.readFileSync(`${mainDir}/server/logs/session-log.json`, { encoding: 'utf-8' });

	const dataToSend = JSON.stringify({
		objective: 'update client logs',
		content: curLog,
	});

	const frame = toDataFrame('1', '0', '0', '0', '1', '0', dataToSend);

	socket.write(frame);
};
