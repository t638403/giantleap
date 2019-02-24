const MidiOut = require('@giantleap/MidiOut');

class Uc33 {

	constructor(reDeviceName) {
		this.deviceNo = this.getDeviceNo(reDeviceName);
	}

	/**
	 * There is a variable number in the device names, so i need to jump through some hoops
	 *
	 * @param reDeviceName
	 */
	getDeviceNo(reDeviceName) {
		const [deviceName] = Object.keys(Uc33.ports).filter(deviceName => reDeviceName.test(deviceName));
		return Uc33.ports[deviceName];
	}

}

Uc33.F1   = {channel: 1,nr: 7};
Uc33.C10  = {channel: 1,nr: 10};
Uc33.C18  = {channel: 1,nr: 12};
Uc33.C26  = {channel: 1,nr: 13};

Uc33.F2   = {channel: 2,nr: 7};
Uc33.C11  = {channel: 2,nr: 10};
Uc33.C19  = {channel: 2,nr: 12};
Uc33.C27  = {channel: 2,nr: 13};

Uc33.F3   = {channel: 3,nr: 7};
Uc33.C12  = {channel: 3,nr: 10};
Uc33.C20  = {channel: 3,nr: 12};
Uc33.C28  = {channel: 3,nr: 13};

Uc33.F4   = {channel: 4,nr: 7};
Uc33.C13  = {channel: 4,nr: 10};
Uc33.C21  = {channel: 4,nr: 12};
Uc33.C29  = {channel: 4,nr: 13};

Uc33.F5   = {channel: 5,nr: 7};
Uc33.C14  = {channel: 5,nr: 10};
Uc33.C22  = {channel: 5,nr: 12};
Uc33.C30  = {channel: 5,nr: 13};

Uc33.F6   = {channel: 6,nr: 7};
Uc33.C15  = {channel: 6,nr: 10};
Uc33.C23  = {channel: 6,nr: 12};
Uc33.C31  = {channel: 6,nr: 13};

Uc33.F7   = {channel: 7,nr: 7};
Uc33.C16  = {channel: 7,nr: 10};
Uc33.C24  = {channel: 7,nr: 12};
Uc33.C32  = {channel: 7,nr: 13};

Uc33.F8   = {channel: 8,nr: 7};
Uc33.C17  = {channel: 8,nr: 10};
Uc33.C25  = {channel: 8,nr: 12};
Uc33.C33  = {channel: 8,nr: 13};

Uc33.STOP = {channel: 1, nr: 14};
Uc33.PLAY = {channel: 1, nr: 15};

Uc33.RWND = {channel: 1, nr: 16};
Uc33.FFWD = {channel: 1, nr: 17};

Uc33.ports = MidiOut.availablePorts();

module.exports = Uc33;