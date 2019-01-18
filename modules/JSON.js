const { Transform } = require('stream');

module.exports = {
	stringify: new Transform({
		objectMode:true,
		transform(obj, _enc, next) {
			for(let k in obj) {
				if(typeof obj[k] === 'bigint') {
					obj[k] = obj[k].toString();
				}
			}
			this.push(JSON.stringify(obj) + '\n');
			next();
		}
	}),
	parse: new Transform({
		objectMode: true,
		transform(str, _enc, next) {
			this.push(JSON.parse(str.toString()));
			next();
		}
	})
};
