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
				const values = cbOrValues.split('').map(value => parseInt(value, 10) * 0.1);
				this.ringBuf = RingBuffer(values);
		}

		if(isArray(cbOrValues)) {
			this.ringBuf = RingBuffer(cbOrValues.map(v => v / 127));
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

const createSynchronizedTrigonometricFunction = (trigonometricFn) => (bpm, factor = 0.5) => t => {
	let cycleInNs;
	if(factor < 1) {
		cycleInNs = ((60n * 1000000000n) / BigInt(bpm)) * BigInt(1 / factor);
	} else {
		cycleInNs = ((60n * 1000000000n) / BigInt(bpm)) / BigInt(factor);
	}
	const nrOfCycles = t / cycleInNs;
	t = Number(t - nrOfCycles * cycleInNs);
	const actual = trigonometricFn( (t / Number(cycleInNs)) * (2 * Math.PI) );
	return 0.5 * actual + 0.5;
};

/**
 * Create a sine function that is synchronized to a bpm.
 *
 * @param bpm
 * @param factor
 * @returns {function(*)}
 */
Value.createSynchronizedSine = createSynchronizedTrigonometricFunction(Math.sin);

/**
 * Create a cosine function that is synchronized to a bpm.
 *
 * @param bpm
 * @param factor
 * @returns {function(*)}
 */
Value.createSynchronizedCosine = createSynchronizedTrigonometricFunction(Math.cos);

module.exports = Value;