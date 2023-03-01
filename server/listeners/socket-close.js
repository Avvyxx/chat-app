const { broadcast } = require('../util');

module.exports = (socketArr) => {
	return () => {
		console.log('Connection closed.');

		socketArr = socketArr.filter((socket) => socket.closed === false);

		broadcast(socketArr, JSON.stringify({ objective: 'update client connected', content: socketArr.length }));
	};
};
