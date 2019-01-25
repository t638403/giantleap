const { Transform } = require('stream');
const msgr = require('@giantleap/utils/Msgr')();

class MidiMsgr extends Transform {

	constructor() {
		super({objectMode:true, highWaterMark:5000});
	}

	_transform(msg, _enc, next) {

		switch(msg.msg) {
			case 'note':
				this.push({
					device: msg.device,
					t:msg.t,
					msg:msgr.noteOn(msg.channel, msg.key || 'C2', msg.velocity || 127)
				});
				this.push({
					device: msg.device,
					t:msg.tEnd,
					msg:msgr.noteOff(msg.channel, msg.key || 'C2', msg.velocity || 127)
				});
				break;
			default:
				// do stuff one day
		}
		next();
	}
}

module.exports = MidiMsgr;