const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Json        = require('@giantleap/JSON')
;

(new Metronome(120, 8))
	.pipe(new Pattern([
		'x.xx'
	]))
	.pipe(Json.stringify)
	.pipe(process.stdout)
;
