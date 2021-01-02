const { Transform } = require('stream');
const RingBuffer = require('@giantleap/utils/RingBuffer');
const isArray = require('@giantleap/utils/underdash/isArray');
const range = require('@giantleap/utils/underdash/range');

/**
 * SampleRepeat - Record a bunch of values and repeat this record over en over
 *
 * Example, sample for 32 beats and repeat:
 *
 * m120()
 *    .pipe(new Value(Value.rand(bpm, 1/32, 0.2, 0.20)))
 *    .pipe(new Nrpn(Electribe.nrpn('S2', 'Pitch')))
 *    .pipe(new SampleRepeat(32))
 *    .pipe(electribe())
 */
class SampleRepeat extends Transform {

	constructor(nrOfTicks) {
		super({objectMode: true});
		this.nrOfTicks = nrOfTicks;
		this.values = [];
		this.rb = null;
	}

	_transform(partialMsg, _enc, next) {

		if(this.values.length === this.nrOfTicks && !this.rb) {
			this.rb = RingBuffer(this.values);
		}

		if(this.values.length < this.nrOfTicks) {
			this.values.push(partialMsg.value);
			this.push(partialMsg);
		} else {
			this.push(Object.assign({}, partialMsg, {value:this.rb.next().value}));
		}

		next();
	}
}

module.exports = SampleRepeat;