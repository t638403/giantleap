const { Transform } = require('stream');
const MidiOut = require('@giantleap/MidiOut');

class Instrument extends Transform {

	constructor(deviceName, midiChannel) {
		super({objectMode:true, highWaterMark:5000});

		this.deviceNo = Instrument.ports[deviceName];
		this.midiChannel = midiChannel;
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {device:this.deviceNo, channel:this.midiChannel}));
		next();
	}

}

Instrument.ports = MidiOut.availablePorts();

module.exports = Instrument;