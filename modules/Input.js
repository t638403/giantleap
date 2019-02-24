const { Transform } = require('stream');
const midi = require('midi');

class Input extends Transform {
	constructor(instrument, msg = {}) {
		super({objectMode:true});
		const type = msg.type || 'note';

		switch (type) {
			case 'ctrl':
				this.input = {
					type,
					device:  instrument.deviceNo,
					channel: msg.channel,
					nr:      msg.nr
				};
				break;
			case 'note':
				this.input = {
					type,
					device:  instrument.deviceNo,
					channel: instrument.midiChannel
				};
				break;
		}

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