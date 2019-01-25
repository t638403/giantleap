const { Transform } = require('stream');

class Instrument extends Transform {

	constructor(deviceNo, midiChannel) {
		super({objectMode:true, highWaterMark:5000});

		this.deviceNo = deviceNo;
		this.midiChannel = midiChannel;
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {device:this.deviceNo, channel:this.midiChannel}));
		next();
	}

}

module.exports = Instrument;