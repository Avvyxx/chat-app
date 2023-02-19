const get = require('./get');
const post = require('./post');

module.exports = (req, res) => {
	if (req.method === 'GET') {
		get(req, res);
	} else if (req.method === 'POST') {
		post(req, res);
	}
};
