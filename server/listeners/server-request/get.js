const fs = require('node:fs');
const path = require('node:path');

const { mainDir, mimeDict } = require('../../util');

module.exports = (req, res) => {
	const requestedFile = `${mainDir}/site${req.url === '/' ? '/index.html' : req.url}`;

	if (fs.existsSync(requestedFile)) {
		const fileContent = fs.readFileSync(requestedFile, { encoding: 'utf-8' });
		const headers = {
			'Content-Type': mimeDict[path.extname(requestedFile)],
		};

		res.writeHead(200, headers);
		res.end(fileContent);
	} else {
		const headers = {
			'Content-Type': 'text/plain',
		};

		res.writeHead(404, headers);
		res.end('404');
	}
};
