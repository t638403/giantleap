const { Transform } = require('stream');

class Device extends Transform {

	constructor(deviceNo) {
		super({objectMode:true, highWaterMark:5000});
		this.deviceNo = deviceNo;
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {device:this.deviceNo}));
		next();
	}

}

module.exports = Device;