const { Transform } = require('stream');

module.exports = {
	stringify: new Transform({
		objectMode:true,
		transform(obj, _enc, next) {
			obj.t = obj.t.toString();
			obj.tEnd = obj.tEnd.toString();
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
