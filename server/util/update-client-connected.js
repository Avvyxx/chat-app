const toDataFrame = require('./to-data-frame');

module.exports = (socket, curConnected) => {
	const dataToSend = JSON.stringify({
		objective: 'update client connected',
		content: curConnected,
	});

	const frame = toDataFrame('1', '0', '0', '0', '1', '0', dataToSend);

	socket.write(frame);
};
