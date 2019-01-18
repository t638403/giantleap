const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Velocity    = require('@giantleap/Velocity'),
	Json        = require('@giantleap/JSON')
;

(new Metronome(120, 8))
	.pipe(new Velocity('3465'))
	.pipe(new Pattern([
		'x.xx'
	]))
	.pipe(Json.stringify)
	.pipe(process.stdout)
;
