const { Transform } = require('stream');

const Msgr = require('@giantleap/utils/Msgr');

/**
 * Reduce all messages into a minimal format that is necessary for being able to send the midi message to the right
 * device at the right time.
 */
class MidiMsgr extends Transform {

	constructor() {
		super({objectMode:true});
	}

	_transform(step, _enc, next) {

		let msg,
			key,
      velocity,
			value,
			ctrl,
			nm,
			nl,
			dl
		;
		const {device, channel, t} = step;

		switch(step.msg) {
			case 'noteOn':
				({key, velocity} = step);
				msg = Msgr.noteOn(channel, key || 'C2', velocity || 100);
				this.push({ device, t, msg });
				break;

			case 'noteOff':
				({key, velocity} = step);
				msg = Msgr.noteOff(channel, key || 'C2', velocity || 100);
				this.push({ device, t, msg });
				break;

			case 'clock':
				msg = Msgr.clock();
				this.push({	device, t, msg });
				break;

			case 'nrpn':
				({nm, nl, dl, value} = step);
				const midiMsgs = Msgr.nrpn(channel, nm, nl, value, dl);
				for(msg of midiMsgs) {
					this.push({ device, t, msg });
				}
				break;

			case 'ctrl':
				({ctrl, value} = step);
				msg = Msgr.ctrl(channel, ctrl, value);
				this.push({ device, t, msg });
				break;

		}
		next();
	}
}

module.exports = MidiMsgr;