const logMessage = require('./log-message');
const clearLog = require('./clear-log');

module.exports = (msgType, msg) => {
	switch (msg) {
		case 'clear_log()':
			clearLog();
			break;
		default:
			logMessage(msgType, msg);
	}
};
