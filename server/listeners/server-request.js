const fs = require('node:fs');
const path = require('node:path');

const { mainDir, mimeDict } = require('../util');

const getEncoding = (extName) => {
	if (extName === '.png' || extName === '.jpg') {
		return null;
	} else {
		return 'utf-8';
	}
};

module.exports = (req, res) => {
	if (req.method === 'GET') {
		const requestedFile = `${mainDir}/site${req.url === '/' ? '/index.html' : req.url}`;
		console.log(requestedFile)

		if (fs.existsSync(requestedFile)) {
			const fileType = path.extname(requestedFile);

			const fileContent = fs.readFileSync(requestedFile, { encoding: getEncoding(fileType) });

			const headers = {
				'Content-Type': mimeDict[fileType],
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
	}
};
