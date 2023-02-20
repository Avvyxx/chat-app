const fs = require('node:fs');

const mainDir = require('../util/main-dir');

module.exports = (message) => {
	const fileExists = fs.readdirSync(`${mainDir}\\server`).includes('message-log.json');

	const logPath = `${mainDir}\\server\\message-log.json`;

	let data;

	if (fileExists) {
		const curData = fs.readFileSync(logPath, { encoding: 'utf-8' });
		const parsedData = JSON.parse(curData);
		data = [
			...parsedData,
			{
				id: parsedData.length,
				message,
			},
		];
	} else {
		data = [
			{
				id: 0,
				message,
			},
		];
	}

	fs.writeFileSync(logPath, JSON.stringify(data), { encoding: 'utf8' });
};
