const fs = require('node:fs');

const mainDir = require('../util/main-dir');

module.exports = (dataTypeIndicator, content) => {
	const lifetimeLogPath = `${mainDir}/server/logs/lifetime-log.json`;
	const sessionLogPath = `${mainDir}/server/logs/session-log.json`;

	const curLifetimeLog = fs.readFileSync(lifetimeLogPath, { encoding: 'utf-8' }) || '[]';
	const parsedLifetimeLog = JSON.parse(curLifetimeLog);

	const curSessionLog = fs.readFileSync(sessionLogPath, { encoding: 'utf-8' }) || '[]';
	const parsedSessionLog = JSON.parse(curSessionLog);

	const updatedLifetimeLog = [
		...parsedLifetimeLog,
		{
			id: parsedLifetimeLog.length,
			type: dataTypeIndicator === 1 ? 'text' : dataTypeIndicator === 2 ? 'file' : null,
			message: content,
		},
	];

	const updatedSessionLog = [
		...parsedSessionLog,
		{
			id: parsedSessionLog.length,
			type: dataTypeIndicator === 1 ? 'text' : dataTypeIndicator === 2 ? 'file' : null,
			message: content,
		},
	];

	fs.writeFileSync(lifetimeLogPath, JSON.stringify(updatedLifetimeLog), { encoding: 'utf-8' });
	fs.writeFileSync(sessionLogPath, JSON.stringify(updatedSessionLog), { encoding: 'utf8' });
};
