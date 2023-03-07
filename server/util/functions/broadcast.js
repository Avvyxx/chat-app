const toDataFrame = require('./to-data-frame')

// TODO: implement this broadcast function where necessary
module.exports = (socketArr, message) => {
	const frame = toDataFrame('1', '0', '0', '0', '1', '0', message);

	socketArr.forEach((socket) => {
		socket.write(frame);
	});
};
