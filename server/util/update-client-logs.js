const fs = require('node:fs');

const toDataFrame = require('./to-data-frame');
const mainDir = require('./main-dir');

module.exports = (socket) => {
	const curData = fs.readFileSync(`${mainDir}/server/message-log.json`, { encoding: 'utf-8' });

	const dataToSend = JSON.stringify({
		objective: 'update client logs',
		content: curData,
	});

	const frame = toDataFrame('1', '0', '0', '0', '1', '0', dataToSend);

	socket.write(frame);
};
