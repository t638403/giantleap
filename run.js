const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Velocity    = require('@giantleap/Velocity'),
	Note        = require('@giantleap/Note'),
	Instrument  = require('@giantleap/Instrument'),
	Json        = require('@giantleap/JSON')
;

const jsonElectribe = require('./modules/instruments/electribe');
const eHH_CLOSED = jsonElectribe.notes.HH_CLOSE;
const electribe = new Instrument(0, 2);

(new Metronome(120, 8))
	.pipe(new Pattern([
		'x.xx'
	]))
	.pipe(new Velocity('036'))
	.pipe(new Note(eHH_CLOSED))
	.pipe(electribe)
	.pipe(Json.stringify)
	.pipe(process.stdout)
;
