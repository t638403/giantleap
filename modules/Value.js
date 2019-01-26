const { Transform } = require('stream');
const rand127 = () => Math.round(Math.random() * 127);

class Value extends Transform {
	constructor(cb = rand127) {
		super({objectMode:true, highWaterMark:5000});
		this.cb = cb;
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, { value: this.cb(partialMidiMsg) }));
		next();
	}
}

module.exports = Value;