// File double-stream.js
const { Transform } = require('stream'),
	RingBuffer = require('@giantleap/utils/RingBuffer'),
	isArray = require('@giantleap/utils/underdash/isArray')
;

class Pattern extends Transform {

	constructor(patStr, variations=false) {
		super({objectMode:true});
		this.prevStepType = null;

		// join the array of strings patterns.
		patStr = patStr.join('');

		// A hit is a key press with a duration (eventually)
		this.hit = null;

		// Variations are variations on the main pattern every x beats. They are key value pairs where the key represents
		// the number of beats when the variation should play, the value is the variation pattern. At this point, the
		// variation pattern must be exactly as long as the main pattern.
		//
		// Example:
		// ...
		// .pipe(new Pattern([
		// 		'x..x....' // <- main pattern
		// 	], {
		// 		4:'x..x..x.',  // <- A variation played every 4 beats
		// 		16:'xx.x..xx', // <- A variation played every 16 beats
		// 		32:'x.x.x.x.'  // <- A variation played every 32 beats
		// 	}))
		// ...
		//
		if(variations) {
			const enlargedPatStr = [];
			const variationIndexes = Object.keys(variations);
			const longestIndex = Math.max(...variationIndexes);
			for(let i=1; i <= longestIndex; i++) {
				enlargedPatStr[i-1] = patStr;
				for(const variationIndex of variationIndexes) {
					if(i % variationIndex === 0) {
						enlargedPatStr[i-1] = variations[variationIndex]
					}
				}
			}
			patStr = [].concat(...enlargedPatStr).join('');
		}

		this.pattern = RingBuffer(patStr.split(''));
	}

	_transform(step, encoding, done) {

		const stepType = this.pattern.next().value;
		switch(stepType) {
			case 'x':
				if(this.prevStepType === 'x' || this.prevStepType === '=') {
					// There must be a tiny delay between noteOff and noteOn or machines start to expose undesirable
					// behaviour, like hanging notes. 3ms seems long enough for our machines to react, and it is short
					// enough for us humans to not notice.
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