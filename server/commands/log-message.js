const fs = require('node:fs');
const path = require('node:path');

const { mainDir } = require('../util');

module.exports = (msgType, content) => {
	const lifetimeLogPath = path.join(mainDir, 'server', 'logs', 'lifetime-log.json');
	const sessionLogPath = path.join(mainDir, 'server', 'logs', 'session-log.json');

	const curLifetimeLog = fs.readFileSync(lifetimeLogPath, { encoding: 'utf-8' }) || '[]';
	const parsedLifetimeLog = JSON.parse(curLifetimeLog);

	const curSessionLog = fs.readFileSync(sessionLogPath, { encoding: 'utf-8' }) || '[]';
	const parsedSessionLog = JSON.parse(curSessionLog);

	const updatedLifetimeLog = [
		...parsedLifetimeLog,
		{
			id: parsedLifetimeLog.length,
			type: msgType,
			message: content,
		},
	];

	const updatedSessionLog = [
		...parsedSessionLog,
		{
			id: parsedSessionLog.length,
			type: msgType,
			message: content,
		},
	];

	fs.writeFileSync(lifetimeLogPath, JSON.stringify(updatedLifetimeLog), { encoding: 'utf-8' });
	fs.writeFileSync(sessionLogPath, JSON.stringify(updatedSessionLog), { encoding: 'utf-8' });
};
