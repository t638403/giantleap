const { Transform } = require('stream');
const RingBuffer = require('@giantleap/utils/RingBuffer');
const isArray = require('lodash/isArray');

const rand127 = () => Math.round(Math.random() * 127);

class Value extends Transform {
	constructor(cbOrValues = rand127) {
		super({objectMode:true});
		switch(typeof cbOrValues) {
			case 'function':
				this.cb = cbOrValues;
				break;
			case 'string':
				this.ringBuf = RingBuffer(cbOrValues.split('').map(s => Math.round(parseInt(s, 10) * 127)));
				this.cb = () => this.ringBuf.next().value;
		}

		if(isArray(cbOrValues)) {
			this.ringBuf = RingBuffer(cbOrValues);
			this.cb = () => this.ringBuf.next().value;
		}
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, { value: this.cb(partialMidiMsg) }));
		next();
	}
}

module.exports = Value;