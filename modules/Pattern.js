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
		this.prevStepType = null;

		// A hit is a key press with a duration (eventually)
		this.hit = null;
		this.pattern = RingBuffer(patStr.split(''));
	}

	_transform(step, encoding, done) {

		const stepType = this.pattern.next().value;
		switch(stepType) {
			case 'x':
				if(this.prevStepType === 'x' || this.prevStepType === '=') {
					// There must be a tiny delay between noteOff and noteOn or machines start to expose undesirable
					// behaviour, like hanging notes. 3ms seems to be long enough for our mighty machines to react, and
					// it is short enough for us mighty humans to not notice.
					this.hit.tEnd = step.t - 3000000n;
					this.push(Object.assign({}, this.hit));
				}
				this.hit = Object.assign({}, step, {msg:'note'});
				break;
			case '.':
				if(this.prevStepType === '=' || this.prevStepType === 'x') {
					this.hit.tEnd = step.t;
					this.push(Object.assign({}, this.hit));
					this.hit = null;
				}
				break;
		}
		this.prevStepType = stepType;
		done();
	}

	/**
	 * The pattern can never know when to end the last note, so it ends the last note in a second
	 *
	 * @param done
	 * @private
	 */
	_final(done) {
		if (this.hit !== null) {
			this.hit.tEnd = this.hit.t + 1000000000n;
			this.push(Object.assign({}, this.hit));
		}
		done();
	}

}

module.exports = Pattern;