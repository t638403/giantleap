const Instrument  = require('@giantleap/Instrument');
const json = require('@giantleap/instruments/electribe');

class Electribe extends Instrument {

	static nrpn(key, paramName) {
		const param = json
			.params
			.filter(param =>
				param.type === 'nrpn'
				&& param.name === paramName
				&& param.key === key
			)[0];
		delete param.type;
		if(!param) throw new Error(`No such param, ${key}/${paramName}`);
		return param;
	}

}

Electribe.S1 = "C2";
Electribe.S2 = "D2";
Electribe.S3 = "E2";
Electribe.S4 = "F2";
Electribe.A1 = "G2";
Electribe.A2 = "A2";
Electribe.HH_CLOSE = "B2";
Electribe.HH_OPEN = "C3";
Electribe.CRASH = "D3";
Electribe.CLAP = "E3";

module.exports = Electribe;