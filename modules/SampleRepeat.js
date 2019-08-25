const { Transform } = require('stream');
const RingBuffer = require('@giantleap/utils/RingBuffer');
const isArray = require('@giantleap/utils/underdash/isArray');
const range = require('@giantleap/utils/underdash/range');

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