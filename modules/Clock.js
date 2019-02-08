const { Transform } = require('stream');

class Clock extends Transform {
	constructor() {
		super({objectMode:true});
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {msg:'clock'}));
		next();
	}
}

module.exports = Clock;