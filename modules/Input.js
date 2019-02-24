const { Transform } = require('stream');
const midi = require('midi');

class Input extends Transform {
	constructor(instrument, {type, channel, nr}) {
		super({objectMode:true});
		this.input = {
			type,
			device:instrument.deviceNo,
			channel,
			nr
		};
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {input:this.input}));
		next();
	}

	_final() {
		this.input.closePort();
	}
}

module.exports = Input;