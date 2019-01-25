const { Transform } = require('stream');

module.exports = {
	stringify: new Transform({
		objectMode:true, highWaterMark:5000,
		transform(obj, _enc, next) {
			this.push(JSON.stringify(obj, (k, v) => {
				if(typeof v === 'bigint') {
					return v.toString()
				}
				return v;
			}) + '\n');
			next();
		}
	}),
	parse: new Transform({
		objectMode:true, highWaterMark:5000,
		transform(str, _enc, next) {
			this.push(JSON.parse(str.toString()));
			next();
		}
	})
};
