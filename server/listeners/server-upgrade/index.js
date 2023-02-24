const socketReadable = require('../socket-readable');
const { openingHandshake, updateClientLogs } = require('../../util');

const sockets = [];

module.exports = (req, socket) => {
	console.log('Client requested upgrade.');

	openingHandshake(req, socket);
	sockets.push(socket);

	updateClientLogs(socket);

	socket.on('readable', () => {
		socketReadable(socket, sockets);
	});

	socket.on('close', () => {
		console.log('Connection closed.');
	});
};
