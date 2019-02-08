const fs = require('fs');
const path = require('path');

fs
	.readdirSync('./')
	.filter(v => /\.js$/.v.test())
	.forEach(jsFile => {
		const key = jsFile.match(/^(.*?)\.js$/)[0];
		module.exports[key] = require(path.join('./', key));
	})
;