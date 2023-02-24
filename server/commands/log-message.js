const fs = require('node:fs');

const mainDir = require('../util/main-dir');

module.exports = (dataTypeIndicator, content) => {
	const logPath = `${mainDir}/server/message-log.json`;

	const fileExists = fs.readdirSync(`${mainDir}/server`).includes('message-log.json');

	let parsedData = [];
	if (fileExists) {
		const curData = fs.readFileSync(logPath, { encoding: 'utf-8' }) || '[]';
		parsedData = JSON.parse(curData);
	}

	const data = [
		...parsedData,
		{
			id: parsedData.length,
			type: dataTypeIndicator === 1 ? 'text' : dataTypeIndicator === 2 ? 'file' : null,
			message: content,
		},
	];

	fs.writeFileSync(logPath, JSON.stringify(data), { encoding: 'utf8' });
};
