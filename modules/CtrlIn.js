const { Transform } = require('stream');
const midi = require('midi');

class CtrlIn extends Transform {
	constructor(instrument, {channel, nr}) {
		super({objectMode:true});
		this.ctrlIn = {
			type:'ctrl',
			device:instrument.deviceNo,
			channel,
			nr
		};
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {ctrlIn:this.ctrlIn}));
		next();
	}

	_final() {
		this.input.closePort();
	}
}

module.exports = CtrlIn;