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
		this.noteOn = null;
		this.pattern = RingBuffer(patStr.split(''));
	}

	_transform(partialMidiMsg, encoding, done) {

		const tick = this.pattern.next().value;
		const hit = Object.assign({}, partialMidiMsg, {msg:'note'});

		switch(tick) {
			case 'x':
				if(this.prevTick === 'x' || this.prevTick === '=') {
					// There must be a tiny delay between noteOff and noteOn or machines start to expose undesirable
					// behaviour, like hanging notes. 3ms seems to be long enough for our mighty machines to react, and
					// it is short enough for us mighty humans to not notice.
					this.noteOn.tEnd = hit.t - 3000000n;
					this.push(Object.assign({}, this.noteOn));
					this.noteOn = hit;
				} else {
					this.noteOn = hit;
				}
				break;
			case '.':
				if(this.prevTick === '=' || this.prevTick === 'x') {
					this.noteOn.tEnd = hit.t;
					this.push(Object.assign({}, this.noteOn));
					this.noteOn = null;
				}
				break;
		}
		this.prevTick = tick;
		this.noteOn = hit;
		done();
	}

	/**
	 * The pattern can never know when to end the last note, so it ends the last note in a second
	 *
	 * @param done
	 * @private
	 */
	_flush(done) {
		this.noteOn.tEnd = this.noteOn.t + 1000000000n;
		this.push(Object.assign({}, this.noteOn));
	}

}

module.exports = Pattern;