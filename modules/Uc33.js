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

Uc33.F1   = {type: 'ctrl', channel: 1,nr: 7};
Uc33.C10  = {type: 'ctrl', channel: 1,nr: 10};
Uc33.C18  = {type: 'ctrl', channel: 1,nr: 12};
Uc33.C26  = {type: 'ctrl', channel: 1,nr: 13};

Uc33.F2   = {type: 'ctrl', channel: 2,nr: 7};
Uc33.C11  = {type: 'ctrl', channel: 2,nr: 10};
Uc33.C19  = {type: 'ctrl', channel: 2,nr: 12};
Uc33.C27  = {type: 'ctrl', channel: 2,nr: 13};

Uc33.F3   = {type: 'ctrl', channel: 3,nr: 7};
Uc33.C12  = {type: 'ctrl', channel: 3,nr: 10};
Uc33.C20  = {type: 'ctrl', channel: 3,nr: 12};
Uc33.C28  = {type: 'ctrl', channel: 3,nr: 13};

Uc33.F4   = {type: 'ctrl', channel: 4,nr: 7};
Uc33.C13  = {type: 'ctrl', channel: 4,nr: 10};
Uc33.C21  = {type: 'ctrl', channel: 4,nr: 12};
Uc33.C29  = {type: 'ctrl', channel: 4,nr: 13};

Uc33.F5   = {type: 'ctrl', channel: 5,nr: 7};
Uc33.C14  = {type: 'ctrl', channel: 5,nr: 10};
Uc33.C22  = {type: 'ctrl', channel: 5,nr: 12};
Uc33.C30  = {type: 'ctrl', channel: 5,nr: 13};

Uc33.F6   = {type: 'ctrl', channel: 6,nr: 7};
Uc33.C15  = {type: 'ctrl', channel: 6,nr: 10};
Uc33.C23  = {type: 'ctrl', channel: 6,nr: 12};
Uc33.C31  = {type: 'ctrl', channel: 6,nr: 13};

Uc33.F7   = {type: 'ctrl', channel: 7,nr: 7};
Uc33.C16  = {type: 'ctrl', channel: 7,nr: 10};
Uc33.C24  = {type: 'ctrl', channel: 7,nr: 12};
Uc33.C32  = {type: 'ctrl', channel: 7,nr: 13};

Uc33.F8   = {type: 'ctrl', channel: 8,nr: 7};
Uc33.C17  = {type: 'ctrl', channel: 8,nr: 10};
Uc33.C25  = {type: 'ctrl', channel: 8,nr: 12};
Uc33.C33  = {type: 'ctrl', channel: 8,nr: 13};

Uc33.STOP = {type: 'ctrl', channel: 1, nr: 14};
Uc33.PLAY = {type: 'ctrl', channel: 1, nr: 15};

Uc33.RWND = {type: 'ctrl', channel: 1, nr: 16};
Uc33.FFWD = {type: 'ctrl', channel: 1, nr: 17};

Uc33.ports = MidiOut.availablePorts();

module.exports = Uc33;