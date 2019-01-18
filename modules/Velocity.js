const { Transform } = require('stream');
const RingBuffer    = require('@giantleap/utils/RingBuffer');
const isArray       = require('lodash/isArray');

/**
 * Just like Pattern but for velocities
 */
class Velocity extends Transform {
	constructor(velocities) {
		super({objectMode:true});
		this.velocities = RingBuffer(isArray(velocities) ? velocities : velocities.split('').map(v => parseInt(v, 10)));
		this.prevVelocity = null;
	}

	_transform(partialMidiMsg, _enc, next) {

		const velocity = Math.floor((1 / this.velocities.next().value) * 127);
		this.push(Object.assign({}, partialMidiMsg, {velocity}));

		next();
	}
}

module.exports = Velocity;