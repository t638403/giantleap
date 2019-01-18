// File double-stream.js
const { Transform } = require('stream'),
	RingBuffer = require('@giantleap/utils/RingBuffer'),
	isArray = require('lodash/isArray')
;

class Pattern extends Transform {

	constructor(patStr) {
		super({objectMode:true});
		if(isArray(patStr)) {
			patStr = patStr.join('');
		}
		this.prevTick = null;
		this.prevPartialMidiMsg = null;
		this.pattern = RingBuffer(patStr.split(''));
	}

	_transform(partialMidiMsg, encoding, done) {
		const tick = this.pattern.next().value;

		const noteOn = Object.assign({}, partialMidiMsg, {msg:'noteOn'});

		// Note off basically means duplicating the previous msg while maintaining the current time, and setting the
		// message to noteOff.
		const noteOff = Object.assign({}, this.prevPartialMidiMsg, {msg:'noteOff', t: partialMidiMsg.t});

		switch(tick) {
			case 'x':
				if(this.prevTick === 'x' || this.prevTick === '=') {
					// There must be a tiny delay between noteOff and noteOn or machines start to expose undesirable
					// behaviour, like hanging notes. 3ms seems to be long enough for our mighty machines to react, and
					// it is short enough for us mighty humans to not notice.
					noteOff.t = noteOff.t - BigInt(3);
					this.push(noteOff);
					this.push(noteOn);
				} else {
					this.push(noteOn);
				}
				break;
			case '.':
				if(this.prevTick === '=' || this.prevTick === 'x') {
					this.push(noteOff);
				}
				break;
		}
		this.prevTick = tick;
		this.prevPartialMidiMsg = partialMidiMsg;
		done();
	}

}

module.exports = Pattern;