const fs = require('node:fs');

const openingHandshake = require('./opening-handshake');
const socketReadable = require('../socket-readable');
const toDataFrame = require('../socket-readable/to-data-frame');
const { mainDir } = require('../../util');

const sockets = [];

module.exports = (req, socket) => {
	console.log('Client requested upgrade.');

	openingHandshake(req, socket);
	sockets.push(socket);

	const curLog = fs.readFileSync(`${mainDir}\\server\\message-log.json`, { encoding: 'utf-8' });
	const curLogFrame = toDataFrame('1', '0', '0', '0', '1', '0', curLog);
	socket.write(curLogFrame);

	socket.on('readable', () => {
		socketReadable(socket, sockets);
	});

	socket.on('close', () => {
		console.log('Connection closed.');
	});
};
