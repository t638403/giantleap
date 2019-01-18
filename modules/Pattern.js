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
		const noteOff = {msg:'noteOff'};
		const noteOn = {msg:'noteOn'};
		switch(tick) {
			case 'x':
				if(this.prevTick === 'x' || this.prevTick === '=') {
					// There must be a tiny delay between noteOff and noteOn or machines start to expose undesirable
					// behaviour. 3ms seems to be long enough for the machines to react, and it is short enough
					// for us humans to notice.
					this.push(Object.assign({}, this.prevPartialMidiMsg, noteOff, {t:partialMidiMsg.t - BigInt(3)}));

					this.push(Object.assign({}, partialMidiMsg, noteOn));
				} else {
					this.push(Object.assign({}, partialMidiMsg, noteOn));
				}
				break;
			case '.':
				if(this.prevTick === '=' || this.prevTick === 'x') {
					this.push(Object.assign({}, this.prevPartialMidiMsg, noteOff));
				}
				break;
		}
		this.prevTick = tick;
		this.prevPartialMidiMsg = partialMidiMsg;
		done();
	}

}

module.exports = Pattern;