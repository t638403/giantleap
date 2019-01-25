const { Transform } = require('stream');

class Tap extends Transform {
	constructor(cb = o => o) {
		super({objectMode:true});
		this.cb = cb;
	}

	_transform(o, _enc, next) {
		console.log(o);
		this.cb(o);
		this.push(o);
		next();
	}
}

module.exports = Tap;
