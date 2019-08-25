const { Transform } = require('stream');
const RingBuffer = require('@giantleap/utils/RingBuffer');
const isArray = require('@giantleap/utils/underdash/isArray');

class Value extends Transform {
	constructor(cbOrValues = Math.random) {
		super({objectMode:true});

		this.ringBuf = null;
		this.cb = (_t) => this.ringBuf.next().value;

		switch(typeof cbOrValues) {
			case 'function':
				this.cb = cbOrValues;
				break;
			case 'string':
				const values = cbOrValues
					.split('')

					// converts hexadecimal notation to a value between 0 (inclusive) and 127 (inclusive)
					.map( v => Math.floor( (parseInt(v, 16) / 16 ) * ( 128 + 8) ) );
				this.ringBuf = RingBuffer(values);
		}

		if(isArray(cbOrValues)) {
			this.ringBuf = RingBuffer(cbOrValues.map(v => v * 128));
		}
	}

	_transform(partialMidiMsg, _enc, next) {
		const v = this.cb(partialMidiMsg.t);

		// Electribe does not like values of 0. When a value of 0 is sent as velocity for a note, it will play it like
		// velocity is 127. I use an || here to make it 1 when it would be 0.
		this.push(Object.assign({}, partialMidiMsg, { value: Math.round(v * 127) || 1 }));
		next();
	}
}

/**
 * These trigonometric functions oscilate between 0 and 1, in stead of -1 and 1.
 *
 * @param x
 * @returns {number}
 */
const rand   = (x) => 0.5 * Math.random() + 0.5;
const sine   = (x) => 0.5 * Math.sin(x) + 0.5;
const cosine = (x) => 0.5 * Math.cos(x) + 0.5;
const ramp   = (x) => ((x % (2 * Math.PI)) / (2 * Math.PI));
const slope  = (x) => 1 - ramp(x);
const saw    = (x) => (ramp(x) < 0.5 ? ramp(x) : slope(x)) * 2;
const block  = (x) => (ramp(x) < 0.5 ? 1 : 0);

/**
 * Protect a value when it goes out of bounds
 *
 * @param value
 */
const protect = (value) => {
	if(value < 0) {
		console.warn('fn clipping');
		value = 0;
	}
	if(value > 1) {
		console.warn('fn clipping');
		value = 1;
	}
	return value;
};

/**
 * Create a trigonometric function that is synchronized to the bpm by supplying a trigonometric function that is not
 * synchronized to the bpm. A trigonometric function must oscilate between 0 and 1.
 *
 * @param trigonometricFn
 * @returns {function(*=, *=): function(*)}
 */
const createSynchronizedTrigonometricFunction = (trigonometricFn = sine) =>

	// factor : How many times, for example the sine wave, will repeat it self per beat
	// fnTimes: Multiply the amplitude of the sine
	// fnAdd  : Add/subtract from
	(bpm, factor = 0.5, fnTimes = 1, fnAdd = 0) =>
			$t => {
				let $cycleInNs;
				if(factor < 1) {
					$cycleInNs = ((60n * 1000000000n) / BigInt(bpm)) * BigInt(1 / factor);
				} else {
					$cycleInNs = ((60n * 1000000000n) / BigInt(bpm)) / BigInt(factor);
				}
				const $nrOfCycles = $t / $cycleInNs;
				const t = Number($t - $nrOfCycles * $cycleInNs);
				let value = trigonometricFn( (t / Number($cycleInNs)) * (2 * Math.PI) );

				let times = typeof fnTimes === 'function' ? fnTimes($t) : fnTimes;
				let add = typeof fnAdd === 'function' ? fnAdd($t) : fnAdd;

				value = times * value + add;

				return protect(value);
			};


/**
 * Synchronized versions of the trigonometric functions.
 */
Value.sine   = createSynchronizedTrigonometricFunction(sine);
Value.cosine = createSynchronizedTrigonometricFunction(cosine);
Value.ramp   = createSynchronizedTrigonometricFunction(ramp);
Value.slope  = createSynchronizedTrigonometricFunction(slope);
Value.saw    = createSynchronizedTrigonometricFunction(saw);
Value.block  = createSynchronizedTrigonometricFunction(block);
Value.rand  = createSynchronizedTrigonometricFunction(rand);

module.exports = Value;