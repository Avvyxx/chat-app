const { logMessage, clearLog } = require('../../util/commands');

module.exports = (message) => {
	const { objective, content } = JSON.parse(message);

	if (objective === 'log message') {
		logMessage(content);
	} else if (objective === 'run command') {
		switch (content) {
			case 'clear message log':
				clearLog();
				break;
			// other possible commands
		}
	}
};
