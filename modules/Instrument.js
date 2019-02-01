const { Transform } = require('stream');
const MidiOut = require('@giantleap/MidiOut');

class Instrument extends Transform {

	constructor(reDeviceName, midiChannel) {
		super({objectMode:true, highWaterMark:5000});

		this.deviceNo = this.getDeviceNo(reDeviceName);
		this.midiChannel = midiChannel;
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {device:this.deviceNo, channel:this.midiChannel}));
		next();
	}

	/**
	 * There is a variable number in the device names, so i need to jump through some hoops
	 *
	 * @param reDeviceName
	 */
	getDeviceNo(reDeviceName) {
		const [deviceName] = Object.keys(Instrument.ports).filter(deviceName => reDeviceName.test(deviceName));
		return Instrument.ports[deviceName];
	}

}

Instrument.ports = MidiOut.availablePorts();

module.exports = Instrument;