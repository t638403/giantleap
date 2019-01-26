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

for(const name in json.notes) {
	Electribe[name] = json.notes[name];
}

module.exports = Electribe;