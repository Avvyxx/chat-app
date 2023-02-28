const socketReadable = require('./socket-readable');
const { openingHandshake, updateClientLogs, updateClientConnected } = require('../util');

let sockets = [];

module.exports = (req, socket) => {
	console.log('Client requested upgrade.');

	openingHandshake(req, socket);
	sockets.push(socket);

	updateClientLogs(socket);
	sockets.forEach(updateClientConnected(sockets.length));

	// TODO: ping client to keep connection alive or respond to bing from client
	socket.on('readable', socketReadable(socket, sockets));

	socket.on('close', () => {
		console.log('Connection closed.');

		sockets = sockets.filter((s) => s.closed === false);
		sockets.forEach(updateClientConnected(sockets.length));
	});
};
